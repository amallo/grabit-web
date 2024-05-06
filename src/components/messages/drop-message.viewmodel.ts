import create from "xoid";
import { AppStore } from "../../create-app.store";
import { useAtom } from "@xoid/react";
import { useEffect, useState } from "react";
import { DropMessageReceipt } from "../../core/message/models/drop-message-receipt.model";
import { Err } from "../../core/common/models/err.model";


export const useDropMessageViewModel = (store: AppStore)=>{
    const [anonymousMessage, setAnonymousMessage] = useState("")
    const [clipboard, setClipboard] = useState("")
    const [lastReceipt, receivedLastReceipt] = useState<DropMessageReceipt | undefined>()
    const [lastErr, setErr] = useState<Err | undefined>()
    const [canSubmit, setCanSubmit] = useState(anonymousMessage.length > 0)
    const state = useAtom(store)
    

    useEffect(()=>{
        setCanSubmit(anonymousMessage.length > 0)
    }, [anonymousMessage])

    useEffect(()=>{
        if (state.errors.length === 0) return;
        setErr(state.errors[state.errors.length - 1])
    }, [state.errors])
    
    
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
        store.actions.clearErrors()
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
        hasError: state.errors.length > 0,
        dropAnonymous,
        zero,
        copy,
        lastErr
    }
}

export type DropMessageViewModel = ReturnType<typeof useDropMessageViewModel>