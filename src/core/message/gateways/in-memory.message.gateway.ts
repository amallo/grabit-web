import { NanoIdGenerator } from "../../common/gateways/nanoid.generator";
import { Message } from "../models/message.model";
import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class InMemoryMessageGateway implements MessageGateway{
    private receipts : Record<string, DropMessageResponse> = {}
    constructor(private validityPeriodInHours: number, private receiptIdGenerator: NanoIdGenerator, private delay: number){

    }
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        return new Promise((resolve)=>{
            setTimeout(() => {
                const generatedReceiptId = this.receiptIdGenerator.generate()
                const generatedMessageId = this.receiptIdGenerator.generate()
                const receipt : DropMessageResponse= {
                    receipt: generatedReceiptId,
                    validUntil: new Date(new Date(message.at).getTime() + this.validityPeriodInHours * 3600 * 1000).toISOString()
                }
                this.receipts[generatedMessageId] = receipt
                resolve(receipt)
            }, (Math.random() + 0.3) * this.delay);
        })
    }
    grab(receiptId: string): Promise<Message> {
        throw new Error("Method not implemented.");
    }
    
}