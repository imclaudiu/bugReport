import { IUser, IComment } from '../../../core/models/shared.types';
import { Tag } from '../../../core/models/tag.model';

export enum BugStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum BugPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Bug {
  id: number;
  title: string;
  description: string;
  status: BugStatus;
  priority: BugPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  assignedTo?: number;
  tags: string[];
  comments: Comment[];
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