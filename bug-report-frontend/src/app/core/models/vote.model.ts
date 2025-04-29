export enum VoteType {
    UPVOTE = 'UPVOTE',
    DOWNVOTE = 'DOWNVOTE'
}

export interface Vote {
    id?: number;
    userId: number;
    targetId: number;
    voteType: VoteType;
}

export interface VoteCreateDto {
    targetId: number;
    voteType: VoteType;
}