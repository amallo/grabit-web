import { Message } from "../models/message.model"

export type DropMessageResponse =  {
    id: string
    at: string
    validUntil: string
}
export type DropAnonymousMessageRequest = {
    content: string
    at: string
    messageId: string
}
export interface MessageGateway{
    dropAnonymous(request: DropAnonymousMessageRequest): Promise<DropMessageResponse>
    grab(receiptId: string): Promise<Message>
}