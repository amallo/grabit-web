import { NanoIdGenerator } from "../../common/gateways/nanoid.generator";
import { Message } from "../models/message.model";
import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class InMemoryMessageGateway implements MessageGateway{
    private messages : Record<string, Message> = {}
    constructor(private validityPeriodInHours: number, private receiptIdGenerator: NanoIdGenerator, private delay: number){
    }
    allMessages(){
        return this.messages
    }
    hydrate(messages : Record<string, Message>){
        this.messages = messages
    }
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        return new Promise((resolve)=>{
            setTimeout(() => {
                const generatedReceiptId = this.receiptIdGenerator.generate()
                const receipt : DropMessageResponse= {
                    id: generatedReceiptId,
                    at: new Date().toISOString(),
                    validUntil: new Date(new Date(message.at).getTime() + this.validityPeriodInHours * 3600 * 1000).toISOString()
                }
                this.messages[generatedReceiptId] = {
                    content: message.content
                }
                resolve(receipt)
            }, (Math.random() + 0.3) * this.delay);
        })
    }
    grab(receiptId: string): Promise<Message> {
        return new Promise((resolve)=>{
            setTimeout(() => {
                const message = this.messages[receiptId]
                if (!message) throw new Error("message not found")
                resolve(message)
            }, (Math.random() + 0.3) * this.delay);
        })
    }
    
}