import { Dependencies, CoreStore, createTestCoreStore } from "../../create-core.store"
import { Err } from "../../common/models/err.model"
import { FailureMessageGateway } from "../gateways/failure.message.gateway"
import { FakeDateProvider } from "../../common/gateways/fake-date.provider"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import {  DropMessageResponse } from "../gateways/message.gateway"
import { DropMessageReceipt } from "../models/drop-message-receipt.model"
import { FakeIdGenerator } from "../../common/gateways/fake-id.generator"

export const createMessageFixture = ()=>{
    const messageGateway = new FakeMessageGateway()
    const dateProvider = new FakeDateProvider()

    const idGenerator = new FakeIdGenerator()
    const dependencies: Partial<Dependencies> = {
        messageGateway, dateProvider, idGenerator
    }
    let store : CoreStore = createTestCoreStore(dependencies)

    return {
        givenNowIs(now: Date){
            dateProvider.nowIs(now)
        },
        givenWillDropMessageResponse(response: DropMessageResponse){
            messageGateway.willReturnDropResponse(response)
        },
        givenPreviousError(err: Err){
            store
        },
        givenMessageId(messageId: string){
            idGenerator.willGenerate(messageId)
        },
        whenDroppingAnonymousMessage(params: {content: string}, error?: Error){
            if (error){
                const failureMessageGateway = new FailureMessageGateway()
                failureMessageGateway.willRejectWith(error)
                dependencies.messageGateway = failureMessageGateway
            }
            store = createTestCoreStore(dependencies)
            return store.message.drop(params)
        },
        thenReceiptOfMessageShouldEqual(messageId: string, expected: DropMessageReceipt){
            expect(store.message.receiptsByMessage.value[messageId]).toEqual(expected)
        },
        thenDroppingAnonymousMessageShouldFailWith(err: Err){
            expect(store.message.errors.value).toContainEqual(err)
        },
        thenNoErrors(){
            expect(store.message.errors.value).toEqual([])
        }
    }
    
        
}