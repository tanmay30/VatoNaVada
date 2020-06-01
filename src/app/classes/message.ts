import { User } from '../interface/user';

export class Message {
    message: string;
    createdAt: Date;
    sender: User;


    constructor({messgae, createAt, sender}) {
        this.message = messgae;
        this.createdAt = createAt;
        this.sender = sender;
    }
}
