import { MessageGateway } from "./message/gateways/message.gateway";
import { IdGenerator } from "./common/gateways/id.generator";
import { FakeIdGenerator } from "./common/gateways/fake-id.generator";
import { FakeMessageGateway } from "./message/gateways/fake.message.gateway";
import { DateProvider } from "./common/gateways/date.prodivder";
import { FakeDateProvider } from "./common/gateways/fake-date.provider";
import { Action, AsyncThunk, Middleware, ThunkDispatch, configureStore, isAsyncThunkAction } from "@reduxjs/toolkit";
import { coreReducer } from "./core.reducer";

export type Dependencies = {
    idGenerator: IdGenerator
    messageGateway: MessageGateway
    dateProvider: DateProvider
}

export const createTestStore=(deps: Dependencies = {
    idGenerator: new FakeIdGenerator(),
    messageGateway: new FakeMessageGateway(),
    dateProvider: new FakeDateProvider()
}, preloadedState: RootState)=>{
    const store =  createStore(deps, preloadedState)
    return {
        ...store,
        getDispatchedUseCaseArgs(useCase: AsyncThunk<any, any, any>) {
            const pendingUseCaseAction = store
              .getActions()
              .find((a) => a.type === useCase.pending.toString());
      
            if (!pendingUseCaseAction) return;
      
            if (!isAsyncThunkAction(pendingUseCaseAction)) return;
      
            return pendingUseCaseAction.meta.arg ?? undefined;
          },
    }
}

export const createStore = (deps: Dependencies, preloadedState: RootState)=>{
    const actions: Action[] = [];
    const logActionsMiddleware: Middleware = () => (next) => (action) => {
      actions.push(action as Action);
      return next(action);
    };
    const store =  configureStore({
        reducer: coreReducer,
        middleware(getDefaultMiddleware) {
            return getDefaultMiddleware({
              thunk: {
                extraArgument: deps,
              },
            }).prepend(logActionsMiddleware)
        },
        preloadedState
    })

    return {
        ...store,
        getActions() {
            return actions;
        },
    }
}


export type RootState = ReturnType<typeof coreReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, Action>;
export type AppStore = ReturnType<typeof createStore>