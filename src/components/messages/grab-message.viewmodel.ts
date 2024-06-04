import { AppDispatch, RootState } from "../../core/create-core.store";
import { selectGrabFailure, selectLastGrabbedMessage } from "../../core/message/models/grab.reducer";
import { grabMessage } from "../../core/message/usecases/grab-message.usecase";

interface DestroyedMessageViewModel {
    status: 'destroyed',
    message: string
    grab: ()=>Promise<unknown>
}

interface FailureMessageViewModel {
    status: 'failure',
    failure: string
    grab: ()=>Promise<unknown>
}

interface ReadToGrabViewModel {
    status: 'ready',
    grab: ()=>Promise<unknown>
}



export const createGrabMessageViewModel = ({dispatch, depositId}:{dispatch: AppDispatch, depositId: string})=>(state: RootState) : ReadToGrabViewModel | DestroyedMessageViewModel | FailureMessageViewModel =>{
    const lastMessage = selectLastGrabbedMessage(state)
    const failure  = selectGrabFailure(state, depositId)
    if (lastMessage){
        return {
            status: 'destroyed',
            message: lastMessage.content,
            grab(){
                return dispatch(grabMessage({receipt:depositId}))
            }
        }
    }
    if (failure){
        return {
            status: 'failure',
            failure,
            grab(){
                return dispatch(grabMessage({receipt:depositId}))
            }
        }
    }
    return {
        status: 'ready',
        grab(){
            return dispatch(grabMessage({receipt:depositId}))
        }
    }
}