import { createStore } from "../../create-store"
import { FakeDateProvider } from "../gateways/fake-date.provider"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import {  DropMessageResponse } from "../gateways/message.gateway"
import { DropReceipt } from "../models/drop-receipt.model"
import { createDropAnonymousMessage } from "../usecases/drop-message.usecase"

export const createMessageFixture = ()=>{
    const messageGateway = new FakeMessageGateway()
    const dateProvider = new FakeDateProvider()
    const store = createStore()
    const dropAnonymousMessage = createDropAnonymousMessage(store, {messageGateway, dateProvider})

    return {
        givenNowIs(now: Date){
            dateProvider.nowIs(now)
        },
        givenWillReturnDropResponse(response: DropMessageResponse){
            messageGateway.willReturnDropResponse(response)
        },
        whenDroppingAnonymousMessage(params: {content: string}){
            return dropAnonymousMessage(params)
        },
        thenDropReceiptShouldEqual(receipt: DropReceipt){
            expect(store.message.droppedReceipts.value).toEqual([receipt])
        }
    }
    
        
}