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