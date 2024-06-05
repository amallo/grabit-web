import { AppDispatch, RootState } from "../../core/create-core.store";
import { dropMessage } from "../../core/message/usecases/drop-message.usecase";
import { selectLastDeposit, selectHasDropMessageError } from "../../core/message/models/drop.reducer";



export const createDropMessageViewModel = ({dispatch, content}:{dispatch: AppDispatch, content: string})=>(state: RootState)=>{
    const lastDeposit = selectLastDeposit(state)
    return {
        canSubmit: content.length > 0,
        deposit :lastDeposit?.id,
        canCopyDepositToClipboard: !!lastDeposit,
        hasError: selectHasDropMessageError(state),
        submit(){
            return dispatch(dropMessage(content))
        }
    }
}