import { HttpGateway } from "../../common/gateways/http.gateway";
import { Message } from "../models/message.model";
import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class HttpMessageGateway implements MessageGateway{

    constructor(private http: HttpGateway){}
    
    async dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        return this.http.post("/api/drop", message)
    }
   async grab(receiptId: string): Promise<Message> {
        return this.http.put(`/api/grab/${receiptId}`)
    }
}