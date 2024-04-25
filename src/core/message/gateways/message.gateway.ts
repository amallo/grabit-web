import { Message } from "../models/message.model"

export type DropMessageResponse =  {
    receipt: string
    validUntil: string
}
export type DropAnonymousMessageRequest = {
    content: string
    at: string
    messageId: string
}
export interface MessageGateway{
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse>
    grab(receiptId: string): Promise<Message>
}