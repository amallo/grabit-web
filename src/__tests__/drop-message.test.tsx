import { FakeDateProvider } from "../core/common/gateways/fake-date.provider"
import { FakeIdGenerator } from "../core/common/gateways/fake-id.generator"
import { FakeMessageGateway } from "../core/message/gateways/fake.message.gateway"
import { DropMessageReceipt } from "../core/message/models/drop-message-receipt.model"
import { AppStore, createAppStore } from "../create-app.store"
import { createDropMessageViewModel, useDropMessageViewModel } from "../drop-message.viewmodel"
import { act, renderHook } from "@testing-library/react"

let messageGateway: FakeMessageGateway
let dateProvider: FakeDateProvider
let idGenerator: FakeIdGenerator
let store: AppStore

const setuo=(appStore: AppStore)=>{
    return renderHook(() => useDropMessageViewModel(appStore))
}

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
    store = createAppStore({messageGateway, dateProvider, idGenerator})
})
test("can submit message only if message entered", async ()=>{
    const {result} = setuo(store)
    expect(result.current.canSubmit).toBe(false)
    act(()=>{
        result.current.enterAnonymousMessage("Hey jo")
    })
    expect(result.current.anonymousMessage).toBe("Hey jo")
    expect(result.current.canSubmit).toBe(true)  
})

test("it displays receipt once received", async ()=>{
    const {result} = setuo(store)
    expect(result.current.lastReceipt).toBeUndefined()
    await act(()=>{
        result.current.enterAnonymousMessage("Hey jo")
        return result.current.dropAnonymous()
    })
    expect(result.current.anonymousMessage).toBe('')
    expect(result.current.lastReceipt).toEqual<DropMessageReceipt>({
         droppedAt: '2024-04-04T07:52:19.000Z',
        id: 'receipt-0',
        validUntil: '2024-04-05T07:52:19.000Z'
    })
    expect(result.current.canSubmit).toBe(false)
})

test("sends another message", async ()=>{
    const {result} = setuo(store)
    expect(result.current.lastReceipt).toBeUndefined()
    result.current.zero()
    expect(result.current.anonymousMessage).toBe('')
    expect(result.current.lastReceipt).toBeUndefined()
    expect(result.current.canSubmit).toBeFalsy()
})
