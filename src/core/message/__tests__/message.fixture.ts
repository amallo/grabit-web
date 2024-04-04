import { createStore } from "../../create-store"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"
import {  DropMessageResponse } from "../gateways/message.gateway"

export const createMessageFixture = ()=>{
    const messageGateway = new FakeMessageGateway()
    const store = createStore({messageGateway})


    return {
        givenWillReturnDropResponse(ticket: DropMessageResponse){
            messageGateway.willReturnDropResponse(ticket)
        },
        whenDroppingAnonymousMessage(params: {content: string}){
            return store.message.drop(params)
        },
        thenDroppedMessageShouldReturn(response: DropMessageResponse){
            expect(store.message.droppedTickets.value).toEqual([response])
        }
    }
    
        
}