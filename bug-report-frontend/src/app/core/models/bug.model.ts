import { IUser, IComment, IBug } from './shared.types';

export enum BugStatus {
    SOLVED = 'SOLVED',
    NOT_SOLVED = 'NOT SOLVED'
}

export interface Bug extends IBug {
    status: BugStatus;
    comments?: IComment[];
}