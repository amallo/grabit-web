import { NanoIdGenerator } from "../../common/gateways/nanoid.generator";
import { Message } from "../models/message.model";
import { InMemoryMessageGateway } from "./in-memory.message.gateway";
import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class LocalStorageMessageGateway implements MessageGateway{
    constructor(private storage: InMemoryMessageGateway){}
    
    async dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        const messages = localStorage.getItem("messages")
        this.storage.hydrate(messages ? JSON.parse(messages) : {})
        const response = await this.storage.dropAnonymous(message)
        localStorage.setItem("messages", JSON.stringify(this.storage.allMessages()))
        return response
    }
    async grab(receiptId: string): Promise<Message> {
        const messages = localStorage.getItem("messages")
        this.storage.hydrate(messages ? JSON.parse(messages) : {})
        const message = await this.storage.grab(receiptId)
        localStorage.setItem("messages", JSON.stringify(this.storage.allMessages()))
        return message
    }
    
}