import { NanoIdGenerator } from "../../common/gateways/nanoid.generator";
import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class InMemoryMessageGateway implements MessageGateway{
    private receipts : Record<string, DropMessageResponse[]> = {}
    constructor(private validityPeriodInHours: number, private receiptIdGenerator: NanoIdGenerator, private delay: number){

    }
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                const generatedReceiptId = this.receiptIdGenerator.generate()
                const generatedMessageId = this.receiptIdGenerator.generate()
                const receipt : DropMessageResponse= {
                    message: generatedMessageId,
                    receipt: generatedReceiptId,
                    validUntil: new Date(new Date(message.at).getTime() + this.validityPeriodInHours * 3600 * 1000).toISOString()
                }
                this.receipts[generatedMessageId] = [...this.receipts[generatedMessageId], receipt].filter(Boolean)
                resolve(receipt)
            }, (Math.random() + 0.3) * this.delay);
        })
    }
}