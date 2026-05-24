import * as signalR from '@microsoft/signalr';

export interface Notification {
  id: number;
  type: 'Like' | 'Comment' | 'Follower';
  message: string;
  actorUsername: string;
  createdAt: string;
  isRead: boolean;
}

export const useSignalR = () => {
  const config = useRuntimeConfig();
  // Припускаємо, що у вас є логіка авторизації. Якщо інакше — замініть на свій спосіб отримання токена.
  const { token, isLoggedIn } = useAuth(); 

  const connection = ref<signalR.HubConnection | null>(null);
  const notifications = useState<Notification[]>('notifications', () => []);
  const isLoading = ref(false);
  
  const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length);

  // 1. Завантаження історії з бази даних
  const fetchNotifications = async () => {
    if (!isLoggedIn.value) return;
    
    isLoading.value = true;
    try {
      const data = await $fetch<Notification[]>(`${config.public.apiBase}/api/notifications`, {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      notifications.value = data;
    } catch (error) {
      console.error('Помилка завантаження історії сповіщень:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // 2. Підключення до SignalR для нових сповіщень
  const startConnection = async () => {
    if (connection.value || !isLoggedIn.value || !token.value) return;

    connection.value = new signalR.HubConnectionBuilder()
      .withUrl(`${config.public.apiBase}/notificationHub`, {
        accessTokenFactory: () => token.value as string
      })
      .withAutomaticReconnect()
      .build();

    connection.value.on('ReceiveNotification', (notification: Notification) => {
      // Додаємо нове сповіщення на початок списку
      notifications.value.unshift(notification);
    });

    try {
      await connection.value.start();
    } catch (err) {
      console.error('Помилка підключення до SignalR:', err);
    }
  };

  const stopConnection = async () => {
    if (connection.value) {
      await connection.value.stop();
      connection.value = null;
    }
  };

  // 3. Прочитання сповіщення (Оптимістичний UI)
  const markAsRead = async (id: number) => {
    const notif = notifications.value.find(n => n.id === id);
    if (!notif || notif.isRead) return; 

    // Змінюємо локально для швидкості
    notif.isRead = true;

    try {
      await $fetch(`${config.public.apiBase}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value}` }
      });
    } catch (error) {
      console.error('Не вдалося позначити як прочитане:', error);
      // Якщо сервер видав помилку, повертаємо статус назад
      notif.isRead = false;
    }
  };

  // Автоматичний контроль
  if (import.meta.client) {
    watch(isLoggedIn, async (loggedIn) => {
      if (loggedIn) {
        await fetchNotifications(); // Відразу тягнемо історію, щоб був правильний badge на дзвіночку
        startConnection();
      } else {
        stopConnection();
        notifications.value = [];
      }
    }, { immediate: true });
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead
  };
};