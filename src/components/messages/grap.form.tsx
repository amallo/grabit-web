import { FormControl, FormLabel, Textarea, Button, useToast, useClipboard } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useStore } from "../store.context"
import { useAtom } from "@xoid/react"
import { CheckIcon, CopyIcon } from "@chakra-ui/icons"
type GrabStatus = "ready"| "destroyed"|'failure'
export const GrabFormControl = ()=>{
    const [grabStatus, setGrabStatus] = useState<GrabStatus>("ready")
    const {receiptId} = useParams()
    const store = useStore()
    const { onCopy, setValue, hasCopied } = useClipboard('', {timeout: 2000 })

   const state = useAtom(store)

    const grab = async ()=>{
      if (!receiptId){
        throw new Error("Receipt id not found")
      }
      return store.actions.grab(receiptId)
    }

    const copyMessage = useCallback(()=>{
      if (!state.lastMessage) return
      setValue(state.lastMessage.content)
      onCopy()
    }, [state.lastMessage])


    useEffect(()=>{
      if (!receiptId){
        throw new Error("Receipt id not found")
      }
    }, [receiptId])

    useEffect(()=>{
      if (state.lastMessage){
        
        setValue(state.lastMessage.content)
        setGrabStatus("destroyed")
        return
      }
      if (state.errors.length > 0){
        setGrabStatus("failure")
        return
      }
    }, [state.errors, state.lastMessage])

    useEffect(()=>{
      switch(grabStatus){
        case 'destroyed':{
          toast({
            title: 'Félicitations !',
            description: `Le message ${receiptId} a bien été lu. Vous pouvez maintenant le copier/coller pour le conserver.`,
            status: 'success',
            duration: 6000,
            isClosable: true,
          })
          return
        }
        case 'failure':{
          toast({
            title: 'Message introuvable',
            description: `Hmm, il semble que ce message n'existe plus.`,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          return
        }
      }
    }, [grabStatus])

    const toast = useToast()
    return <FormControl gap={16} flex={1}>
              {grabStatus === "ready" && <FormLabel flex={1}>Lire et détruire le message {receiptId} ?</FormLabel>}
              {(grabStatus === "destroyed" ) && <FormLabel flex={1}>Le message {receiptId} n'est désormais plus accessible.</FormLabel>}
              { grabStatus === "ready" && 
                <div style={{flex:1, gap:16, display: 'flex', justifyContent: 'space-between'}}>
                  <Button flex={1} colorScheme='teal' onClick={()=>grab()}>Oui je suis prêt !</Button>
                  <Button flex={1} colorScheme='gray'>Non pas encore</Button>
                </div>
              }
              { grabStatus === "destroyed" && store.value.lastMessage &&
                <div style={{display: 'flex', flex:1, gap: 16, flexDirection: 'column'}}>
                  <Textarea style={{border: 0}} value={store.value.lastMessage.content} disabled backgroundColor={"Highlight"}  />
                  <Button leftIcon={hasCopied ? <CheckIcon/>: <CopyIcon/>}  onClick={()=>copyMessage()}>{hasCopied ? 'Copié !': 'Copier le message'}</Button>
                </div>
              }
          </FormControl>
}