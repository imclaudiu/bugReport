export interface Tag {
    id?: number;
    name: string;
}

export interface BugTag {
    bugId: number;
    tagId: number;
}