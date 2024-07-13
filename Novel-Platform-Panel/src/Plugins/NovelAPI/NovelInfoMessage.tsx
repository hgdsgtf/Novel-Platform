import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage';

export class NovelInfoMessage extends NovelMessage {
    title: string;
    username: string;

    constructor(title: string, username: string) {
        super();
        this.title = title;
        this.username = username;
    }

}
