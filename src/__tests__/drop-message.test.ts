import { error } from "console"
import { FakeDateProvider } from "../core/common/gateways/fake-date.provider"
import { FakeIdGenerator } from "../core/common/gateways/fake-id.generator"
import { FakeMessageGateway } from "../core/message/gateways/fake.message.gateway"
import { DropMessageReceipt } from "../core/message/models/drop-message-receipt.model"
import { createAppStore } from "../create-app.store"
import { createDropMessageViewModel } from "../drop-message.viewmodel"

let messageGateway: FakeMessageGateway
let dateProvider: FakeDateProvider
let idGenerator: FakeIdGenerator
beforeEach(()=>{
    messageGateway = new FakeMessageGateway()
    messageGateway.willReturnDropResponse({
         validUntil: '2024-04-05T07:52:19.000Z',
         receipt: 'receipt-0'
    })
    dateProvider = new FakeDateProvider()
    dateProvider.nowIs(new Date("2024-04-04T07:52:19.000Z"))

    idGenerator = new FakeIdGenerator()
    idGenerator.willGenerate("message0")
    
})
test("can submit message only if message entered", async ()=>{
    const store = createAppStore({messageGateway, dateProvider, idGenerator})
    const viewModel = createDropMessageViewModel(store)
    expect(viewModel.selectors.$canSubmit.value).toBe(false)
    viewModel.$state.actions.enterAnonymousMessage("Hey jo")
    expect(viewModel.$state.value.anonymousMessage).toBe("Hey jo")
    expect(viewModel.selectors.$canSubmit.value).toBe(true)
})

test("it displays receipt once received", async ()=>{
    const store = createAppStore({messageGateway, dateProvider, idGenerator})
    const viewModel = createDropMessageViewModel(store)
    expect(viewModel.$state.value.lastReceipt).toBeUndefined()
    viewModel.$state.actions.enterAnonymousMessage("Hey jo")
    await viewModel.$state.actions.dropAnonymous()
    expect(viewModel.$state.value.anonymousMessage).toBe('')
    expect(viewModel.$state.value.lastReceipt).toEqual<DropMessageReceipt>({
         droppedAt: '2024-04-04T07:52:19.000Z',
        id: 'receipt-0',
        validUntil: '2024-04-05T07:52:19.000Z'
    })
})

test("it initializes to send another message", async ()=>{
    const store = createAppStore({messageGateway, dateProvider, idGenerator})
    const viewModel = createDropMessageViewModel(store)
    expect(viewModel.$state.value.lastReceipt).toBeUndefined()
    viewModel.$state.actions.zero()
    expect(viewModel.$state.value.anonymousMessage).toBe('')
    expect(viewModel.$state.value.lastReceipt).toBeUndefined()
    expect(viewModel.selectors.$canSubmit.value).toBeFalsy()
})
