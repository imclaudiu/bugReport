export interface Comment {
  id: number;
  text: string;
  date: Date;
  imageURL?: string;
  voteCount: number;
  author: {
    id: number;
    username: string;
    banned?: boolean;
  };
  bug: {
    id: number;
  };
  parent?: Comment;
  replies?: Comment[];
}
