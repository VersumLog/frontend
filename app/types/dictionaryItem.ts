export interface DictionaryItem {
  id: string | number;
  postId: string | number;
  phrase: string;
  description: string;
  anchorId: string;
  post?: {
    title: string;
  };
}