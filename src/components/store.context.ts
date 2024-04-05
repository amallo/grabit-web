import { createContext } from 'react';
import { AppStore, createAppStore } from '../create-app.store';
import { NanoIdGenerator } from '../core/common/gateways/nanoid.generator';
import { InMemoryMessageGateway } from '../core/message/gateways/in-memory.message.gateway';
import { RealDateProvider } from '../core/common/gateways/real-date.provider';


export const appStore = createAppStore({
      idGenerator: new NanoIdGenerator(),
      messageGateway : new InMemoryMessageGateway(0.1, new NanoIdGenerator(), 300),
      dateProvider : new RealDateProvider()
})
export const StoreContext = createContext<AppStore>(appStore);