import { createStore } from "../../create-store"
import { FakeIdGenerator } from "../gateways/fake-id.generator"
import { FakeMessageGateway } from "../gateways/fake.message.gateway"

describe("FEATURE: drop a message", ()=>{
    test("Pierre drops an anoymous message", async ()=>{
        const idGenerator = new FakeIdGenerator()
        idGenerator.willGenerate("message0")
        const messageGateway = new FakeMessageGateway()
        const store = createStore({messageGateway, idGenerator})
        messageGateway.willBeDroppedWithTicket({
            id: 'ticket0',
            messageId: 'message0',
            validUntil: 'tommorrow',
        })
        await store.message.drop({content: 'hello guy'})
        expect(store.message.droppedTickets.value).toEqual([{
            id: 'ticket0',
            validUntil: 'tommorrow',
            messageId: 'message0'
        }])
        expect(messageGateway.wasAnonymouslyDroppedWith()).toEqual({id: 'message0', content: 'hello guy'})
    })
/*
    test("Pierre fails to send a message", async ()=>{
        const messageGateway = new FailureMessageGateway()
        messageGateway.willRejectWith(new Error("Gateway error"))
        const sendMessage = createSendMessage({messageGateway})
        const response = await sendMessage({content: 'hello guy'})
        expect(response.ticket).toEqual({
            id: 'ticket0',
            validUntil: 'tommorrow',
            link: 'http://grabit.com/message-id'
        })
    })*/
})