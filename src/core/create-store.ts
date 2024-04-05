import { signal } from "@preact/signals-react";
import { MessageGateway, DropMessageResponse } from "./message/gateways/message.gateway";
import { IdGenerator } from "./message/gateways/id.generator";
import { Params, Result, createDropAnonymousMessage } from "./message/usecases/drop-message.usecase";
import { FakeIdGenerator } from "./message/gateways/fake-id.generator";
import { FakeMessageGateway } from "./message/gateways/fake.message.gateway";
import { DropMessageReceipt } from "./message/models/drop-message-receipt.model";
import { DateProvider } from "./message/gateways/date.prodivder";
import { FakeDateProvider } from "./message/gateways/fake-date.provider";
import { MessageStore } from "./message/stores/message.store";

export type Dependencies = {
    idGenerator: IdGenerator
    messageGateway: MessageGateway
    dateProvider: DateProvider
}
export class Store{
    constructor(private _message: MessageStore){}
    get message() : MessageStore {
        return this._message
    }
}

export const createTestStore=(deps: Partial<Dependencies>)=>{
    const testingDeps : Dependencies = {
        idGenerator: new FakeIdGenerator(),
        messageGateway: new FakeMessageGateway(),
        dateProvider: new FakeDateProvider()
    }
    return createStore({...testingDeps, ...deps})
}
export const createStore = (deps: Dependencies)=>{
    const messageStore = new MessageStore(deps)
    return  new Store(messageStore)
}
