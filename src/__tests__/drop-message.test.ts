import { FakeDateProvider } from "../core/common/gateways/fake-date.provider"
import { FakeIdGenerator } from "../core/common/gateways/fake-id.generator"
import { FakeMessageGateway } from "../core/message/gateways/fake.message.gateway"
import { DropMessageReceipt } from "../core/message/models/drop-message-receipt.model"
import { createAppStore } from "../create-app.store"
import { createDropMessageViewModel } from "../drop-message.viewmodel"

test("it drops an anonymous message", async ()=>{
    const messageGateway = new FakeMessageGateway()
    messageGateway.willReturnDropResponse({
         validUntil: '2024-04-05T07:52:19.000Z',
         receipt: 'receipt-0'
    })
    const dateProvider = new FakeDateProvider()
    dateProvider.nowIs(new Date("2024-04-04T07:52:19.000Z"))

    const idGenerator = new FakeIdGenerator()
    idGenerator.willGenerate("message0")
    
    const store = createAppStore({messageGateway, dateProvider, idGenerator})
    const viewModel = createDropMessageViewModel(store)
    await viewModel.dropAnonymousMessage({content: "hey"})
    expect(viewModel.hasDropMessageFailure.value).toBe(false)
    expect(viewModel.lastMessageId.value).toBe("message0")
    expect(viewModel.lastReceipt.value).toEqual<DropMessageReceipt>({
         droppedAt: '2024-04-04T07:52:19.000Z',
         validUntil: '2024-04-05T07:52:19.000Z',
         id: 'receipt-0'
    })
})