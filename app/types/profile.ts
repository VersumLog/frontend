export interface UserProfile {
  username: string;
  name: string;
  bio: string;
  createdAt: string;
  isAuthor: boolean;
  isOwner: boolean;
  isFollowing?: boolean;
  worksCount: number;
  followingCount: number;
  followersCount: number;
}