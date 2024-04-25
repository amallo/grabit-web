import create from "xoid";
import { AppStore } from "./create-app.store";
import { useAtom } from "@xoid/react";
import { useMemo } from "react";
import { DropMessageReceipt } from "./core/message/models/drop-message-receipt.model";
type ViewModelState = {
    anonymousMessage: string
    clipboard: string
    lastReceipt?: DropMessageReceipt
}
export const createDropMessageViewModel = (store: AppStore)=>{ 
    const initialState : ViewModelState = {
        anonymousMessage: '',
        clipboard: ''
    }
    const $state = create(initialState, (atom) => ({
        enterAnonymousMessage: (message: string) => {
           atom.set({
                clipboard: '',
                anonymousMessage: message
           })
        },
        clearAnonymousMessage(){
            atom.set({
                clipboard: '',
                anonymousMessage: ''
            })
        },
        receivedAReceipt(r: DropMessageReceipt | undefined){
            atom.update((state)=>{
                return {
                    ...state,
                    lastReceipt: r,
                    clipboard: '',
                    anonymousMessage: ''
                }
            })
        },
        zero(){
            this.clearAnonymousMessage()
        },
        async dropAnonymous(){
            const r = await store.actions.dropAnonymous({ content: $state.value.anonymousMessage });
            this.receivedAReceipt(r)
        }
    }))
    const $canSubmit = create((read)=>read($state).anonymousMessage.length > 0)
    return {$state, selectors: {$canSubmit}}
}

export const useDropMessageViewModel = (store: AppStore)=>{
    const vm = useMemo(()=>createDropMessageViewModel(store), [])
    const state = useAtom(vm.$state)
    const canSubmit = useAtom(vm.selectors.$canSubmit)
    return {
        ...vm.$state.actions,
        ...state,
        canSubmit
    }
}