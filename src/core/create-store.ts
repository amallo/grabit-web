import { signal } from "@preact/signals-react";
import { MessageGateway, MessageTicketResponse } from "./message/gateways/message.gateway";
import { IdGenerator } from "./message/gateways/id.generator";
import { Params, Result, createDropAnonymousMessage } from "./message/usecases/drop-message.usecase";
import { FakeIdGenerator } from "./message/gateways/fake-id.generator";
import { FakeMessageGateway } from "./message/gateways/fake.message.gateway";

export type Dependencies = {
    idGenerator: IdGenerator
    messageGateway: MessageGateway
}
export class Store{
    constructor(private _message: MessageStore){}
    get message() : MessageStore {
        return this._message
    }
}
const initialDeps : Dependencies = {
    idGenerator: new FakeIdGenerator(),
    messageGateway: new FakeMessageGateway()
}

export const createStore=(deps: Partial<Dependencies>)=>{
    const messageStore = new MessageStore({...initialDeps, ...deps})
    return  new Store(messageStore)
}

export class MessageStore{
    private _droppedTickets = signal<MessageTicketResponse[]>([]);
    constructor(private deps: Dependencies){}
    async drop(params: Params): Promise<Result>{
        const response = await createDropAnonymousMessage(this.deps)(params)
        this.notifyDroppedTicket(response.ticket)
        return response
    }
    get droppedTickets(){
        return this._droppedTickets
    }
    notifyDroppedTicket(ticket: MessageTicketResponse){
        this._droppedTickets.value.push(ticket)
    }
}
