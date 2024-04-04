import { createStore } from "../../create-store"
import { FakeDateProvider } from "../gateways/fake-date.provider"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import {  DropMessageResponse } from "../gateways/message.gateway"
import { AnonymousDropReceipt } from "../models/drop-receipt.model"

export const createMessageFixture = ()=>{
    const messageGateway = new FakeMessageGateway()
    const dateProvider = new FakeDateProvider()
    const store = createStore({messageGateway, dateProvider})

    return {
        givenNowIs(now: Date){
            dateProvider.nowIs(now)
        },
        givenWillReturnDropResponse(response: DropMessageResponse){
            messageGateway.willReturnDropResponse(response)
        },
        whenDroppingAnonymousMessage(params: {content: string}){
            return store.message.drop(params)
        },
        thenDropReceiptShouldEqual(receipt: AnonymousDropReceipt){
            expect(store.message.droppedReceipts.value).toEqual([receipt])
        }
    }
    
        
}