import { ITag } from './shared.types';

export interface Tag extends ITag {}

export interface BugTag {
    bugId: number;
    tagId: number;
}