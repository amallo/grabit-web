import { createContext, useContext } from 'react';
import { AppStore, createAppStore } from '../create-app.store';
import { NanoIdGenerator } from '../core/common/gateways/nanoid.generator';
import { RealDateProvider } from '../core/common/gateways/real-date.provider';
import { HttpMessageGateway } from '../core/message/gateways/http.message.gateway';


export const appStore = createAppStore({
      idGenerator: new NanoIdGenerator(),
      messageGateway : new HttpMessageGateway(),
      dateProvider : new RealDateProvider()
})
export const StoreContext = createContext<AppStore>(appStore);

export const useStore = ()=>{
    const store = useContext(StoreContext)
    return store
}