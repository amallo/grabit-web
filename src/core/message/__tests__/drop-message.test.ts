
import { createMessageFixture } from "./message.fixture"

describe("FEATURE: drop a message", ()=>{
    test("drop an anoymous message", async ()=>{
        const messageFixture = createMessageFixture()
        messageFixture.givenNowIs(new Date("2024-04-04T07:52:19.000Z"))
        messageFixture.givenWillDropMessageResponse({
            receipt: 'receipt0',
            validUntil: '2024-04-04T10:52:19+02:00',
        })
        await messageFixture.whenDroppingAnonymousMessage({content: 'my credit card number'})
        messageFixture.thenDropMessageReceiptShouldEqual({
            id: 'receipt0',
            droppedAt: '2024-04-04T07:52:19.000Z',
            validUntil: '2024-04-04T10:52:19+02:00',
        })
    })
    test("fail to drop an anoymous message", async ()=>{
        const messageFixture = createMessageFixture()
        messageFixture.givenNowIs(new Date("2024-04-04T07:52:19.000Z"))
        messageFixture.givenWillDropMessageResponse({
            receipt: 'receipt0',
            validUntil: '2024-04-04T10:52:19+02:00',
        })
        await messageFixture.whenDroppingAnonymousMessage({content: 'my credit card number'}, new Error("gateway failure"))
        messageFixture.thenDroppingAnonymousMessageShouldFailWith({
            code: 'DROP_MESSAGE_ERROR',
            causedBy: 'GATEWAY_ERROR',
            message: 'gateway failure',
        })
    })

})