
import { createMessageFixture } from "./message.fixture"

describe("FEATURE: drop a message", ()=>{
    test("Pierre drops an anoymous message", async ()=>{
        const messageFixture = createMessageFixture()
        messageFixture.givenWillReturnDropResponse({
            receipt: 'receipt0',
            validUntil: 'tommorrow',
        })
        await messageFixture.whenDroppingAnonymousMessage({content: 'hello guy'})
        messageFixture.thenDroppedMessageShouldReturn({
            receipt: 'receipt0',
            validUntil: 'tommorrow',
        })
    })

})