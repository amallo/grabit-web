import create from "xoid";
import { AppStore } from "./create-app.store";
type ViewModelState = {
    anonymousMessage: string
}
export const createDropMessageViewModel = ({$state: store}: AppStore)=>{ 
    const initialState : ViewModelState = {
        anonymousMessage: '',
    }
    const $state = create(initialState, (atom) => ({
        enterAnonymousMessage: (message: string) => {
           atom.set({
                anonymousMessage: message
           })
        },
        clearAnonymousMessage(){
            atom.set({
                anonymousMessage: ''
            })
        },
        zero(){
            this.clearAnonymousMessage()
        },
        async dropAnonymous(){
            const r = await store.actions.dropAnonymous({ content: $state.value.anonymousMessage });
            this.clearAnonymousMessage();
        }
    }))
    const $canSubmit = create((read)=>read($state).anonymousMessage.length > 0)
    return {$state, selectors: {$canSubmit}}
}