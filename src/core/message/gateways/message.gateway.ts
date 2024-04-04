export type DropMessageResponse =  {
    receipt: string
    validUntil: string
}
export type DropAnonymousMessageRequest = {
    id: string
    content: string
    at: string
}
export interface MessageGateway{
    dropAnonymous(message: DropAnonymousMessageRequest): Promise<DropMessageResponse>
}