import { NanoIdGenerator } from "../../common/gateways/nanoid.generator";
import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class InMemoryMessageGateway implements MessageGateway{
    private receipts : DropMessageResponse[] = []
    constructor(private validityPeriodInHours: number, private receiptIdGenerator: NanoIdGenerator, private delay: number){

    }
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                const receipt : DropMessageResponse= {
                    receipt: this.receiptIdGenerator.generate(),
                     validUntil: new Date(new Date(message.at).getTime() + this.validityPeriodInHours * 3600 * 1000).toISOString()
                }
                this.receipts.push(receipt)
                resolve(receipt)
            }, (Math.random() + 0.3) * this.delay);
        })
    }
}