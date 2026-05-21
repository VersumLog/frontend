import { ref } from 'vue';

export function useDraftActions(postId: string | number, writingState: any) {
  const config = useRuntimeConfig();
  const { token, nickname } = useAuth();
  
  const isSaving = ref(false);
  const errorMessage = ref('');
  const showSuccessMessage = ref(false);

  const updateDraft = async () => {
    isSaving.value = true;
    errorMessage.value = '';
    try {
      await $fetch(`${config.public.apiBase}/api/posts/${postId}/update-draft`, {
        method: 'POST',
        headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
        body: writingState
      });
      showSuccessMessage.value = true;
      setTimeout(() => { showSuccessMessage.value = false; }, 2000);
      return true;
    } catch (error: any) {
      errorMessage.value = error.data?.errors 
        ? (Object.values(error.data.errors).flat()[0] as string)
        : (error.data?.message || "Не вдалося зберегти чернетку");
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  const publishPost = async () => {
    const success = await updateDraft();
    if (!success) return;

    isSaving.value = true;
    try {
      await $fetch(`${config.public.apiBase}/api/posts/${postId}/publish-draft`, {
        method: 'POST',
        headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
        body: writingState
      });
      navigateTo(`/profile/${nickname.value}`);
    } catch (error: any) {
      errorMessage.value = error.data?.message || "Не вдалося опублікувати твір";
    } finally {
      isSaving.value = false;
    }
  };

  return {
    isSaving,
    errorMessage,
    showSuccessMessage,
    updateDraft,
    publishPost
  };
}