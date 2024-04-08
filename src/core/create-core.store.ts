import { MessageGateway } from "./message/gateways/message.gateway";
import { IdGenerator } from "./common/gateways/id.generator";
import { FakeIdGenerator } from "./common/gateways/fake-id.generator";
import { FakeMessageGateway } from "./message/gateways/fake.message.gateway";
import { DateProvider } from "./common/gateways/date.prodivder";
import { FakeDateProvider } from "./common/gateways/fake-date.provider";
import { MessageStore } from "./message/stores/message.store";

export type Dependencies = {
    idGenerator: IdGenerator
    messageGateway: MessageGateway
    dateProvider: DateProvider
}
export class CoreStore{
    constructor(public readonly message: MessageStore){}
}

export const createTestCoreStore=(deps: Dependencies = {
    idGenerator: new FakeIdGenerator(),
    messageGateway: new FakeMessageGateway(),
    dateProvider: new FakeDateProvider()
})=>{
    return createCoreStore(deps)
}
export const createCoreStore = (deps: Dependencies)=>{
    const messageStore = new MessageStore(deps)
    return  new CoreStore(messageStore)
}

class CoreStoreBuilder{
    _message!: MessageStore
    withMessageStore(message: MessageStore){
        this._message = message
        return this
    }
    build(){
        return new CoreStore(this._message)
    }
}

export const coreStore = ()=>{
    const builder = new CoreStoreBuilder()
    return {
        withMessage(message: MessageStore){
            return builder.withMessageStore(message)
        },
        build(){
            return builder.build()
        }
    }
}