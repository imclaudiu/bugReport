import { IUser, IComment, IBug } from './shared.types';
import { Tag } from './tag.model';

export enum BugStatus {
    RECEIVED = 'RECEIVED',
    IN_PROGRESS = 'IN_PROGRESS',
    SOLVED = 'SOLVED'
}

export interface Bug extends IBug {
    status: BugStatus;
    comments?: IComment[];
    tags?: Tag[];
}