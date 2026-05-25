export interface PostGetDto {
  title: string;
  description: string;
  content: string;
  createdAt: string;
  postId: number;
  username: string;
  name: string;
  genres: string[];
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
  isSavedByUser: boolean;
}