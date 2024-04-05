import { Dependencies, Store, createTestStore } from "../../create-store"
import { Err } from "../../error/models/err.model"
import { FailureMessageGateway } from "../gateways/failure.message.gateway"
import { FakeDateProvider } from "../gateways/fake-date.provider"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import {  DropMessageResponse } from "../gateways/message.gateway"
import { DropMessageReceipt } from "../models/drop-message-receipt.model"

export const createMessageFixture = ()=>{
    const messageGateway = new FakeMessageGateway()
    const dateProvider = new FakeDateProvider()
    const dependencies: Partial<Dependencies> = {
        messageGateway, dateProvider
    }
    let store : Store

    return {
        givenNowIs(now: Date){
            dateProvider.nowIs(now)
        },
        givenWillDropMessageResponse(response: DropMessageResponse){
            messageGateway.willReturnDropResponse(response)
        },
        whenDroppingAnonymousMessage(params: {content: string}, error?: Error){
            if (error){
                const failureMessageGateway = new FailureMessageGateway()
                failureMessageGateway.willRejectWith(error)
                dependencies.messageGateway = failureMessageGateway
            }
            store = createTestStore(dependencies)
            return store.message.drop(params)
        },
        thenDropMessageReceiptShouldEqual(expected: DropMessageReceipt){
            expect(store.message.droppedReceipts.value).toEqual([expected])
        },
        thenDroppingAnonymousMessageShouldFailWith(err: Err){
            expect(store.message.dropErrors.value).toContainEqual(err)
        }
    }
    
        
}