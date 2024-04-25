
import { createMessageFixture } from "./message.fixture"

describe("FEATURE: grab a message", ()=>{
    test("grab a message by receipt", async ()=>{
        const messageFixture = createMessageFixture()
        messageFixture.givenNowIs(new Date("2024-04-04T07:52:19.000Z"))
        messageFixture.givenWillDropMessageResponse({
            receipt: 'receipt0',
            validUntil: '2024-04-04T10:52:19+02:00',
        })
        messageFixture.givenPreviousError({
            code: 'DROP_MESSAGE_ERROR',
            causedBy: 'GATEWAY_ERROR',
            message: 'gateway failure',
        })
        messageFixture.givenGrabbedMessage({content: "my credit card number"})
        await messageFixture.whenGrabbingMessage("receipt0")
        messageFixture.thenDeliveredMessageShouldBe({content: "my credit card number"})
        messageFixture.thenGrabHasBeenCalledWith("receipt0")
        messageFixture.thenNoErrors()
    })


    test("fail to grab message", async ()=>{
        const messageFixture = createMessageFixture()
        await messageFixture.whenGrabbingMessage({content: 'my credit card number'}, new Error("gateway failure"))
        messageFixture.thenShouldFailWith({
            code: 'GRAB_MESSAGE_ERROR',
            causedBy: 'GATEWAY_ERROR',
            message: 'gateway failure',
        })
        
    })

})