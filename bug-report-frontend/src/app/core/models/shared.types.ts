// Shared interfaces to break circular dependencies
export interface IUser {
    id?: number;
    username: string;
    email: string;
    password?: string;
    phone?: string;
    score?: number;
    isModerator: boolean;
    isBanned: boolean;
}

export interface IBug {
    id?: number;
    author: IUser;
    title: string;
    description: string;
    creationDate: Date;
    imageURL?: string;
    status: string;
    voteCount: number;
    comments?: IComment[];
    tags?: ITag[];
}

export interface IComment {
    id?: number;
    bug: IBug;
    author: IUser;
    text: string;
    creationDate: Date;
    imageURL?: string;
    voteCount: number;
}

export interface ITag {
    id?: number;
    name: string;
} 