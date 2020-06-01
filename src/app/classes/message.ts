import { User } from './user';

export class Message {
    message: string;
    createAt: Date;
    sender: User;


    constructor({messgae, createAt, sender}){
        this.message = messgae;
        this.createAt = createAt;
        this.sender = new User(sender);
    }
}
