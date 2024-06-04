
import { createMessageFixture } from "./message.fixture"

describe("FEATURE: grab a message", ()=>{
    test("grab a message by deposit", async ()=>{
        const messageFixture = createMessageFixture()
        messageFixture.givenMessageForDeposit({
            depositId: "deposit-0",
            content: "hello !"
        })
        await messageFixture.whenGrabbingMessage("deposit-0")
        messageFixture.thenGrabbedMessageShouldBe({content: "hello !"})
        messageFixture.thenGrabHasBeenCalledWith("deposit-0")
    })

    test("fail to grab message", async ()=>{
        const messageFixture = createMessageFixture()
        const useCase =  messageFixture.whenGrabbingMessage('deposit-0', new Error("gateway failure"))
        messageFixture.thenShouldGrabbing()
        await useCase
        messageFixture.thenGrabMessageShouldFailWith({depositId:'deposit-0' , failWith: "GATEWAY_ERROR"})  
    })

})