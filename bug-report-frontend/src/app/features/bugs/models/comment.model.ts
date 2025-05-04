export interface Comment {
  id: number;
  text: string;
  date: string;
  imageURL?: string;
  voteCount: number;
  author: {
    id: number;
    username: string;
  };
  bug: {
    id: number;
  };
} 