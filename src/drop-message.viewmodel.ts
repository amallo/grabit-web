import create from "xoid";
import { AppStore } from "./create-app.store";
import { useAtom } from "@xoid/react";
import { useMemo } from "react";
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

export const useDropMessageViewModel = (store: AppStore)=>{
    const vm = useMemo(()=>createDropMessageViewModel(store), [])
    const state = useAtom(vm.$state)
    const canSubmit = useAtom(vm.selectors.$canSubmit)
    const lastReceipt = useAtom(store.selectors.$lastReceipt)
    return {
        lastReceipt,
        ...vm.$state.actions,
        ...state,
        canSubmit
    }
}