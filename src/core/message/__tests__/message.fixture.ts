import { Dependencies, CoreStore, createTestCoreStore, coreStore } from "../../create-core.store"
import { Err } from "../../common/models/err.model"
import { FailureMessageGateway } from "../gateways/failure.message.gateway"
import { FakeDateProvider } from "../../common/gateways/fake-date.provider"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import {  DropMessageResponse } from "../gateways/message.gateway"
import { DropMessageReceipt } from "../models/drop-message-receipt.model"
import { FakeIdGenerator } from "../../common/gateways/fake-id.generator"
import { MessageStore } from "../stores/message.store"

export const createMessageFixture = ()=>{
    const messageGateway = new FakeMessageGateway()
    const dateProvider = new FakeDateProvider()

    const idGenerator = new FakeIdGenerator()
    const dependencies: Dependencies = {
        messageGateway, dateProvider, idGenerator
    }
    const messageStore = new MessageStore(dependencies)
    const storeBuilder = coreStore().withMessage(messageStore)
    const store = storeBuilder.build()

    return {
        givenNowIs(now: Date){
            dateProvider.nowIs(now)
        },
        givenWillDropMessageResponse(response: DropMessageResponse){
            messageGateway.willReturnDropResponse(response)
        },
        givenPreviousError(err: Err){
            messageStore.appendPreviousErr(err)
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