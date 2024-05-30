import { AppStore, Dependencies, RootState, createStore, createTestCoreStore } from "../../create-core.store"
import { Err } from "../../common/models/err.model"
import { FailureMessageGateway } from "../gateways/failure.message.gateway"
import { FakeDateProvider } from "../../common/gateways/fake-date.provider"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import {  DropMessageResponse } from "../gateways/message.gateway"
import { DropMessageReceipt } from "../models/drop-message-receipt.model"
import { FakeIdGenerator } from "../../common/gateways/fake-id.generator"
import { Message } from "../models/message.model"
import { grabMessage } from "../usecases/grab-message.usecase"
import { dropMessage } from "../usecases/drop-message.usecase"
import { StateBuilder, createMessageStateBuilder, createRootStateBuilder } from "../../state.builder"
export const createMessageFixture = (stateBuilder: StateBuilder = createRootStateBuilder())=>{
    const messageGateway = new FakeMessageGateway()
    const dateProvider = new FakeDateProvider()

    const idGenerator = new FakeIdGenerator()
    const dependencies: Dependencies = {
        messageGateway, dateProvider, idGenerator
    }
  
    let store: AppStore
    const messageStateBuilder = createMessageStateBuilder()
    stateBuilder.withMessage(messageStateBuilder)
    
    return {
        givenNowIs(now: Date){
            dateProvider.nowIs(now)
        },
        givenWillReturnDropResponse(response: DropMessageResponse){
            messageGateway.willReturnDropResponse(response)
        },
        givenPreviousError(err: Err){
            messageStateBuilder.appendError(err)
        },
        givenWillGenerateMessageId(messageId: string){
            idGenerator.willGenerate(messageId)
        },
        givenWillGrabMessage(message: Message){
            messageGateway.willGrabMessage(message)
        },
        whenDroppingAnonymousMessage(params: {content: string}, error?: Error){
            store = createStore(dependencies, stateBuilder.build())
            if (error){
                const failureMessageGateway = new FailureMessageGateway()
                failureMessageGateway.willRejectWith(error)
                dependencies.messageGateway = failureMessageGateway
            }
            return store.dispatch(dropMessage({content: params.content}))
        },
        whenGrabbingMessage(receiptId: string,  error?: Error){
            store = createStore(dependencies, stateBuilder.build())
            if (error){
                const failureMessageGateway = new FailureMessageGateway()
                failureMessageGateway.willRejectWith(error)
                dependencies.messageGateway = failureMessageGateway
            }
            return store.dispatch(grabMessage({receipt: receiptId}))
        },
        thenReceiptOfMessageShouldEqual(messageId: string, expected: DropMessageReceipt){
            expect(store.getState().message.receiptsByMessage[messageId]).toEqual(expected)
        },
        thenShouldFailWith(err: Err){
            expect(store.getState().message.errors).toContainEqual(err)
        },
        thenNoErrors(){
            expect(store.getState().message.errors).toEqual([])
        },
        thenGrabbedMessageShouldBe(message: Message){
            expect(store.getState().message.lastMessage).toEqual(message)
        },
        thenGrabHasBeenCalledWith(receiptId: string){
            expect(messageGateway.wasGrabbedWith()).toBe(receiptId)
        }
    }
    
        
}