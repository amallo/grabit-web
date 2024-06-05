import { createTestStore } from "../../../core/create-core.store"
import { deposit } from "../../../core/message/models/drop-message-receipt.model"
import { dropSlice } from "../../../core/message/models/drop.reducer"
import { dropMessage } from "../../../core/message/usecases/drop-message.usecase"
import { dropState, rootState } from "../../../core/state.builder"
import { createDropMessageViewModel } from "../drop-message.viewmodel"

it("can submit or restart when message content is not empty", async ()=>{
    const store = createTestStore(undefined, rootState()
                    .build())
    const dropMessageViewModel = createDropMessageViewModel({dispatch: store.dispatch, content: "hello" })(store.getState())
    expect(dropMessageViewModel).toMatchObject({
        canSubmit: true,
        canCopyDepositToClipboard: false,
    })
    await dropMessageViewModel.submit()
    expect(store.getDispatchedUseCaseArgs(dropMessage)).toEqual("hello")
})


it("can copy deposit's link to clipboard once it has been submitted", ()=>{
    const store = createTestStore(undefined, rootState()
                    .withDropState(dropState()
                        .withDeposit({messageId: 'message0', withDeposit: deposit({id: 'http://deposit0'}).build()}))
                    .build())
    const dropMessageviewModel = createDropMessageViewModel({dispatch: jest.fn(), content: ''})(store.getState())
    expect(dropMessageviewModel).toMatchObject({
        canSubmit: false,
        canCopyDepositToClipboard: true,
        deposit: 'http://deposit0',
        hasError: false
    })
})


it("Clear forms to restart input", ()=>{
    const store = createTestStore(undefined, rootState()
                    .build())
    const dispatch = jest.fn()
    const dropMessageviewModel = createDropMessageViewModel({dispatch, content: ''})(store.getState())
    dropMessageviewModel.clear()
    expect(dispatch).toHaveBeenCalledWith(dropSlice.actions.clearLastDeposit())
})
it("can copy deposit's link to clipboard once it has been submitted", ()=>{
    const store = createTestStore(undefined, rootState()
                    .withDropState(dropState()
                        .withDeposit({messageId: 'message0', withDeposit: deposit({id: 'http://deposit0'}).build()}))
                    .build())
    const dropMessageviewModel = createDropMessageViewModel({dispatch: jest.fn(), content: ''})(store.getState())
    expect(dropMessageviewModel).toMatchObject({
        canSubmit: false,
        canCopyDepositToClipboard: true,
        deposit: 'http://deposit0',
        hasError: false
    })
})


it("display errors", ()=>{
    const store = createTestStore(undefined, rootState()
                    .withDropState(dropState()
                        .withFailure({messageId: "message-0", failWith: "FAILURE"}))
                    .build())
    const dropMessageviewModel = createDropMessageViewModel({dispatch: jest.fn(), content: ''})(store.getState())
    expect(dropMessageviewModel).toMatchObject({
        canSubmit: false,
        canCopyDepositToClipboard: false,
        hasError: true
    })
})
