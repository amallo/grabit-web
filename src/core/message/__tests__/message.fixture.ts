import { Dependencies, coreStore } from "../../create-core.store"
import { Err } from "../../common/models/err.model"
import { FailureMessageGateway } from "../gateways/failure.message.gateway"
import { FakeDateProvider } from "../../common/gateways/fake-date.provider"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import {  DropMessageResponse } from "../gateways/message.gateway"
import { DropMessageReceipt } from "../models/drop-message-receipt.model"
import { FakeIdGenerator } from "../../common/gateways/fake-id.generator"
import { createMessageStoreWithDeps } from "../stores/message.store"
import { expect } from 'vitest';
import { unwrap } from "solid-js/store"

export const createMessageFixture = ()=>{
    const messageGateway = new FakeMessageGateway()
    const dateProvider = new FakeDateProvider()

    const idGenerator = new FakeIdGenerator()
    const dependencies: Dependencies = {
        messageGateway, dateProvider, idGenerator
    }
    const createMessageStore = createMessageStoreWithDeps(dependencies)
    const messageStore = createMessageStore()
    return {
        givenNowIs(now: Date){
            dateProvider.nowIs(now)
        },
        givenWillDropMessageResponse(response: DropMessageResponse){
            messageGateway.willReturnDropResponse(response)
        },
        givenPreviousError(err: Err){
            messageStore.onDropMessageError(err)
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
            return messageStore.drop(params)
        },
        thenReceiptOfMessageShouldEqual(messageId: string, expected: DropMessageReceipt){
            expect(messageStore.selectReceipt(messageId)).toEqual(expected)
        },
        thenDroppingAnonymousMessageShouldFailWith(err: Err){
            expect(messageStore.selectState().errors).toContainEqual(err)
        },
        thenNoErrors(){
            expect(messageStore.selectState().errors).toEqual([])
        }
    }
    
        
}