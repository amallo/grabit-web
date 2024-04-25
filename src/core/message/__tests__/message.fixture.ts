import { Dependencies } from "../../create-core.store"
import { Err } from "../../common/models/err.model"
import { FailureMessageGateway } from "../gateways/failure.message.gateway"
import { FakeDateProvider } from "../../common/gateways/fake-date.provider"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import {  DropMessageResponse } from "../gateways/message.gateway"
import { DropMessageReceipt } from "../models/drop-message-receipt.model"
import { FakeIdGenerator } from "../../common/gateways/fake-id.generator"
import {  createMessageStore } from "../stores/message.store"
import { Message } from "../models/message.model"
export const createMessageFixture = ()=>{
    const messageGateway = new FakeMessageGateway()
    const dateProvider = new FakeDateProvider()

    const idGenerator = new FakeIdGenerator()
    const dependencies: Dependencies = {
        messageGateway, dateProvider, idGenerator
    }
    const store = createMessageStore(dependencies)
    
    return {
        givenNowIs(now: Date){
            dateProvider.nowIs(now)
        },
        givenWillDropMessageResponse(response: DropMessageResponse){
            messageGateway.willReturnDropResponse(response)
        },
        givenPreviousError(err: Err){
            store.actions.appendError(err)
        },
        givenMessageId(messageId: string){
            idGenerator.willGenerate(messageId)
        },
        givenGrabbedMessage(message: Message){
            messageGateway.willGrabMessage(message)
        },
        whenDroppingAnonymousMessage(params: {content: string}, error?: Error){
            if (error){
                const failureMessageGateway = new FailureMessageGateway()
                failureMessageGateway.willRejectWith(error)
                dependencies.messageGateway = failureMessageGateway
            }
            return store.actions.dropAnonymous(params)
        },
        whenGrabbingMessage(receiptId: string,  error?: Error){
            if (error){
                const failureMessageGateway = new FailureMessageGateway()
                failureMessageGateway.willRejectWith(error)
                dependencies.messageGateway = failureMessageGateway
            }
            return store.actions.grab(receiptId)
        },
        thenReceiptOfMessageShouldEqual(messageId: string, expected: DropMessageReceipt){
            expect(store.value.receiptsByMessage[messageId]).toEqual(expected)
        },
        thenShouldFailWith(err: Err){
            expect(store.value.errors).toContainEqual(err)
        },
        thenNoErrors(){
            expect(store.value.errors).toEqual([])
        },
        thenDeliveredMessageShouldBe(message: Message){
            expect(store.value.lastMessage).toEqual(message)
        },
        thenGrabHasBeenCalledWith(receiptId: string){
            expect(messageGateway.wasGrabbedWith()).toBe(receiptId)
        }
    }
    
        
}