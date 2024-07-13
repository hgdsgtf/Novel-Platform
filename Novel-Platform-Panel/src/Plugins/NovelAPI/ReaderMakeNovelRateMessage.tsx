import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage';

export class ReaderMakeNovelRateMessage extends NovelMessage {
    title: string;
    rating: number;
    username: string;

    constructor(title: string, rating: number, username: string) {
        super();
        this.title = title;
        this.rating = rating;
        this.username = username;
    }

}
