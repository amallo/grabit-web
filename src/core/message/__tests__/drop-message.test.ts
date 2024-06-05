
import { date } from "../../common/models/date.builder"
import { deposit } from "../models/drop-message-receipt.model"
import { createMessageFixture } from "./message.fixture"

describe("FEATURE: drop a message", ()=>{
    test("drop a text message", async ()=>{
        const messageFixture = createMessageFixture()
        messageFixture.givenNowIs(new Date(date().at()))
        messageFixture.givenDepositForMessage({
            forMessage: "message-0",
            deposit: deposit({
                id: 'deposit-0',
                at: date().at(),
                validUntil: date().validUntil(),
            }).build()
        })
        messageFixture.givenWillGenerateMessageId("message-0")
        const usecase =  messageFixture.whenDroppingTextMessage({content: 'my credit card number'})
        messageFixture.thenShouldDropping()
        await usecase
        messageFixture.thenDepositShouldBe({forMessage:'message-0' , expected: {
            id: 'deposit-0',
            at: date().at(),
            validUntil: date().validUntil(),
        }})
        messageFixture.thenDropMessageShouldHaveBeenCalledWith('my credit card number')
    })

    test("fail to drop a text message", async ()=>{
        const messageFixture = createMessageFixture()
        messageFixture.givenNowIs(new Date("2024-04-04T07:52:19.000Z"))
        messageFixture.givenWillGenerateMessageId("message-0")
        const usecase =  messageFixture.whenDroppingTextMessage({content: 'my credit card number'}, new Error("Drop Failure"))
        messageFixture.thenShouldDropping()
        await usecase
        messageFixture.thenDropMessageShouldFailWith({messageId:'message-0' , failWith: "GATEWAY_ERROR"})
    })
    

})