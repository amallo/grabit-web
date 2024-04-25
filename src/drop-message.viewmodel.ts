import create from "xoid";
import { AppStore } from "./create-app.store";
import { useAtom } from "@xoid/react";
import { useEffect, useMemo, useState } from "react";
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
    const [anonymousMessage, setAnonymousMessage] = useState("")
    const [clipboard, setClipboard] = useState("")
    const [lastReceipt, receivedLastReceipt] = useState<DropMessageReceipt | undefined>()
    const [canSubmit, setCanSubmit] = useState(anonymousMessage.length > 0)

    useEffect(()=>{
        setCanSubmit(anonymousMessage.length > 0)
    }, [anonymousMessage])
    
    const enterAnonymousMessage = (message: string)=>{
        setAnonymousMessage(message)
    }
    const onReceipt = (r: DropMessageReceipt | undefined)=>{
        receivedLastReceipt(r)
        setClipboard("")
        setAnonymousMessage("")
    }
    const dropAnonymous = async()=>{
        const r = await store.actions.dropAnonymous({ content: anonymousMessage });
        onReceipt(r)
    }
    const zero =()=>{
        setClipboard("")
        setAnonymousMessage("")
        receivedLastReceipt(undefined)
    }
    const copy = ()=>{
        if (!lastReceipt) return
        setClipboard(lastReceipt.id)
    }
    return {
        clipboard,
        enterAnonymousMessage,
        anonymousMessage,
        canSubmit,
        lastReceipt,
        dropAnonymous,
        zero,
        copy
    }
}

export type DropMessageViewModel = ReturnType<typeof useDropMessageViewModel>