import { MessageGateway } from "./message/gateways/message.gateway";
import { IdGenerator } from "./common/gateways/id.generator";
import { FakeIdGenerator } from "./common/gateways/fake-id.generator";
import { FakeMessageGateway } from "./message/gateways/fake.message.gateway";
import { DateProvider } from "./common/gateways/date.prodivder";
import { FakeDateProvider } from "./common/gateways/fake-date.provider";
import { MessageState, createMessageStore } from "./message/stores/message.store";

export type Dependencies = {
    idGenerator: IdGenerator
    messageGateway: MessageGateway
    dateProvider: DateProvider
}

export const createTestCoreStore=(deps: Dependencies = {
    idGenerator: new FakeIdGenerator(),
    messageGateway: new FakeMessageGateway(),
    dateProvider: new FakeDateProvider()
})=>{
    return createCoreStore(deps)
}
export const createCoreStore = (deps: Dependencies, state?: MessageState)=>{
    const messageStore = createMessageStore(deps, state)
    return messageStore
}

export type CoreStore = ReturnType<typeof createCoreStore>
