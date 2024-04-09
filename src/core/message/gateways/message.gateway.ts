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
}