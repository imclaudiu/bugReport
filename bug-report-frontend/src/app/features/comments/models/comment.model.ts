export interface Comment {
  id?: number;
  bugId: number;
  content: string;
  authorId: number;
  creationDate: Date;
  imageURL?: string;
  voteCount: number;
}

export interface CommentCreateDto {
  bugId: number;
  content: string;
  imageURL?: string;
}

export interface CommentUpdateDto {
  content: string;
} 