import { IUser } from '../../../core/models/shared.types';
import { IComment } from '../../../core/models/shared.types';
import { Tag } from '../../../core/models/tag.model';

export enum BugStatus {
  RECEIVED = 'RECEIVED',
  IN_PROGRESS = 'IN PROGRESS',
  SOLVED = 'SOLVED'
}

export enum BugPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Bug {
  id?: number;
  title: string;
  description: string;
  status: BugStatus;
  priority: string;
  creationDate: Date;
  updatedAt?: Date;
  author: IUser;
  assignedTo?: number;
  tags?: Tag[];
  imageURL?: string;
  comments: Comment[];
  voteCount?: number;
}

export interface BugFilter {
  status?: BugStatus;
  priority?: BugPriority;
  assignedTo?: number;
  createdBy?: number;
  tags?: string[];
  search?: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  bugId: number;
}
