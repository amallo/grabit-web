export type MessageTicketResponse =  {
    id: string
    validUntil: string
    messageId: string
}
export type DropAnonymousMessageRequest = {
    id: string
    content: string
}
export interface MessageGateway{
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<MessageTicketResponse>
}