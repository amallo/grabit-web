import { createTestStore } from "../../../core/create-core.store"
import { grabMessage } from "../../../core/message/usecases/grab-message.usecase"
import { grabState, rootState } from "../../../core/state.builder"
import { createGrabMessageViewModel } from "../grab-message.viewmodel"

test("ready to grab message", async ()=>{
    const store = createTestStore(undefined, rootState()
                    .build())
    const viewModel = createGrabMessageViewModel({dispatch: store.dispatch, depositId: 'deposit-0' })(store.getState())
    expect(viewModel).toMatchObject({
        status: 'ready',
    })
})


test("grab message", async ()=>{
    const store = createTestStore(undefined, rootState()
                    .withGrabState(grabState().withLastMessage({content: "hello !!!!"}))
                    .build())
    const viewModel = createGrabMessageViewModel({dispatch: store.dispatch, depositId: 'deposit-0' })(store.getState())
    await viewModel.grab() 
    expect(store.getDispatchedUseCaseArgs(grabMessage)).toEqual({receipt: 'deposit-0'})
    expect(viewModel).toMatchObject({
        status: 'destroyed',
        message: "hello !!!!"
    })
})

test("grab message failure", async ()=>{
    const store = createTestStore(undefined, rootState()
                    .withGrabState(grabState().withFailure({depositId: 'deposit-0', failWith: 'NOT FOUND'}))
                    .build())
    const viewModel = createGrabMessageViewModel({dispatch: store.dispatch, depositId: 'deposit-0' })(store.getState())
    await viewModel.grab() 
    expect(store.getDispatchedUseCaseArgs(grabMessage)).toEqual({receipt: 'deposit-0'})
    expect(viewModel).toMatchObject({
        status: 'failure',
        failure: "NOT FOUND"
    })
})

