import { Message } from "../models/message.model";
import { MessageGateway, DropAnonymousMessageRequest, DropMessageResponse } from "./message.gateway";

export class HttpMessageGateway implements MessageGateway{
    
    async dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse> {
        const result = await fetch("/api/drop", {
            body: JSON.stringify(message),
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            }
        })
        if (result.ok){
            return result.json()
        }
        const error = await result.json()
        throw error
    }
   async grab(receiptId: string): Promise<Message> {
        const result = await fetch(`/api/grab/${receiptId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            }
        })
        if (result.ok){
            return result.json()
        }
        
        const error = await result.json()
        throw error
    }
}