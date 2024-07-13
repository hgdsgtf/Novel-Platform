import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage';

export class ReaderMakeChapterRateMessage extends NovelMessage {
    title: string;
    chapter: number;
    rating: number;
    username: string;

    constructor(title: string, chapter: number, rating: number, username: string) {
        super();
        this.title = title;
        this.chapter = chapter;
        this.rating = rating;
        this.username = username;
    }
}
