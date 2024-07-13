import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage';

export class GetChapterRatingMessage extends NovelMessage {
    title: string;
    chapter: number;
    username:string;

    constructor(title: string, chapter: number,username:string) {
        super();
        this.title = title;
        this.chapter = chapter;
        this.username = username;
    }
}
