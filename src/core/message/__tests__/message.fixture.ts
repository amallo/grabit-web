import { AppStore, Dependencies, createStore } from "../../create-core.store"
import { FailureMessageGateway } from "../gateways/failure.message.gateway"
import { FakeDateProvider } from "../../common/gateways/fake-date.provider"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import { Deposit } from "../models/drop-message-receipt.model"
import { FakeIdGenerator } from "../../common/gateways/fake-id.generator"
import { Message } from "../models/message.model"
import { grabMessage } from "../usecases/grab-message.usecase"
import { dropMessage } from "../usecases/drop-message.usecase"
import { StateBuilder, dropState, grabState, rootState } from "../../state.builder"
export const createMessageFixture = (stateBuilder: StateBuilder = rootState())=>{
    const messageGateway = new FakeMessageGateway()
    const dateProvider = new FakeDateProvider()

    const idGenerator = new FakeIdGenerator()
    const dependencies: Dependencies = {
        messageGateway, dateProvider, idGenerator
    }
  
    let store: AppStore
    
    return {
        givenNowIs(now: Date){
            dateProvider.nowIs(now)
        },
        givenWillGenerateMessageId(messageId: string){
            idGenerator.willGenerate(messageId)
        },
        givenWillGrabMessage(message: Message){
            messageGateway.willGrabMessage(message)
        },
        givenDepositForMessage({forMessage, deposit}:  {forMessage: string, deposit: Deposit}){
            messageGateway.willReturnDepositForMessage(forMessage, deposit)
        },
        givenMessageForDeposit({depositId, content}: {depositId: string, content: string}){
            messageGateway.willReturnMessageForDeposit(depositId, {content})
        },
        async whenDroppingTextMessage(params: {content: string}, error?: Error){
            if (error){
                const failureMessageGateway = new FailureMessageGateway()
                failureMessageGateway.willRejectWith(error)
                dependencies.messageGateway = failureMessageGateway
            }
            store = createStore(dependencies, stateBuilder
                    .build())
            return store.dispatch(dropMessage(params.content))
        },
        whenGrabbingMessage(depositId: string,  error?: Error){
            if (error){
                const failureMessageGateway = new FailureMessageGateway()
                failureMessageGateway.willRejectWith(error)
                dependencies.messageGateway = failureMessageGateway
            }
            store = createStore(dependencies, stateBuilder.build())
            return store.dispatch(grabMessage({receipt: depositId}))
        },
        thenGrabbedMessageShouldBe(message: Message){
            stateBuilder.withGrabState(grabState()
                .withNotLoading()
                .withLastMessage(message))
            expect(store.getState()).toEqual(stateBuilder.build())
        },
        thenGrabHasBeenCalledWith(receiptId: string){
            expect(messageGateway.wasGrabbedWith()).toBe(receiptId)
        },
        thenDepositShouldBe({forMessage, expected}: {forMessage: string, expected: Deposit}){
            stateBuilder.withDropState(dropState()
                .withNotLoading()
                .withDeposit({messageId: forMessage, withDeposit: expected}))
            expect(store.getState()).toEqual(stateBuilder.build())
        },
        thenDropMessageShouldHaveBeenCalledWith(content: string){
            expect(messageGateway.wasDroppedWith().content).toEqual(content)
        },
        thenShouldDropping(){
            stateBuilder.withDropState(dropState()
                .withLoading())
            expect(store.getState()).toEqual(stateBuilder.build())
        },
        thenDropMessageShouldFailWith({messageId, failWith}: {messageId: string, failWith: string}){
            stateBuilder.withDropState(dropState()
                .withNotLoading()
                .withFailure({messageId, failWith}))
            expect(store.getState()).toEqual(stateBuilder.build())
        },
        thenGrabMessageShouldFailWith({depositId, failWith}: {depositId: string, failWith: string}){
            stateBuilder.withGrabState(grabState()
                .withNotLoading()
                .withFailure({depositId, failWith}))
                .build()
            expect(store.getState()).toEqual(stateBuilder.build())
        },
        thenShouldGrabbing(){
            stateBuilder.withGrabState(grabState()
                .withLoading())
            expect(store.getState()).toEqual(stateBuilder.build())
        }
    }
}