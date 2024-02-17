import { Chapter } from './Chapter';
import { PirType } from './PirType';
import { WordPair } from './WordPair';

export class Pir {
  pirId: any;
  editorId: any;
  groupId: any;
  name: string | null;
  description: string;
  chapters: Chapter[];
  wordPairs: WordPair[];
  imageUrl: string | null;
  allowed: boolean;
  author: string;
  type: PirType;

  constructor(
    pirId: any,
    editorId: any,
    groupId: any,
    description: string,
    name: string | null,
    chapters: Chapter[] = [],
    wordPairs: WordPair[] = [],
    imageUrl: string | null,
    allowed: boolean = true
  ) {
    this.pirId = pirId;
    this.editorId = editorId;
    this.groupId = groupId;
    this.name = name || null;
    this.description = description;
    this.chapters = chapters;
    this.wordPairs = wordPairs;
    this.imageUrl = imageUrl || null;
    this.allowed = allowed;
  }
}
