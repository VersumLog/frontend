import * as signalR from '@microsoft/signalr';

export interface Notification {
  id: string;
  type: 'Like' | 'Comment' | 'Follower';
  message: string;
  actorUsername: string;
  createdAt: string;
  isRead: boolean;
}

export const useSignalR = () => {
  const config = useRuntimeConfig();
  const { token, isLoggedIn } = useAuth(); // 
  
  const connection = ref<signalR.HubConnection | null>(null);
  const notifications = useState<Notification[]>('notifications', () => []);
  const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length);

  const startConnection = async () => {
    if (!isLoggedIn.value || !token.value) return; // [cite: 8, 10]

    connection.value = new signalR.HubConnectionBuilder()
      .withUrl(`${config.public.apiBase}/notificationHub`, {
        accessTokenFactory: () => token.value as string // Передаємо JWT токен
      })
      .withAutomaticReconnect()
      .build();

    connection.value.on('ReceiveNotification', (notification: Notification) => {
      notifications.value.unshift(notification);
    });

    try {
      await connection.value.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('Error connecting to SignalR:', err);
    }
  };

  const stopConnection = async () => {
    if (connection.value) {
      await connection.value.stop();
      connection.value = null;
    }
  };

  const markAsRead = (id: string) => {
    const notif = notifications.value.find(n => n.id === id);
    if (notif) notif.isRead = true;
    // Тут також має бути запит на бекенд ($fetch) для збереження стану
  };

  return {
    startConnection,
    stopConnection,
    notifications,
    unreadCount,
    markAsRead
  };
};