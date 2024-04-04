
import { createMessageFixture } from "./message.fixture"

describe("FEATURE: drop a message", ()=>{
    test("Pierre drops an anoymous message", async ()=>{
        const messageFixture = createMessageFixture()
        messageFixture.givenNowIs(new Date("2024-04-04T07:52:19.000Z"))
        messageFixture.givenWillReturnDropResponse({
            receipt: 'receipt0',
            validUntil: '2024-04-04T10:52:19+02:00',
        })
        await messageFixture.whenDroppingAnonymousMessage({content: 'hello guy'})
        messageFixture.thenDropReceiptShouldEqual({
            id: 'receipt0',
            droppedAt: '2024-04-04T07:52:19.000Z',
            validUntil: '2024-04-04T10:52:19+02:00',
        })
    })

})