import { FormControl, FormLabel, Textarea, Button, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useStore } from "../store.context"
type GrabStatus = "ready"| "destroyed"|'failure'
export const GrabFormControl = ()=>{
    const [grabStatus, setGrabStatus] = useState<GrabStatus>("ready")
    const {receiptId} = useParams()
    const store = useStore()
    const grab = async ()=>{
      if (!receiptId){
        throw new Error("Receipt id not found")
      }
      return store.actions.grab(receiptId)
    }
    useEffect(()=>{
      if (!receiptId){
        throw new Error("Receipt id not found")
      }
    }, [receiptId])

    useEffect(()=>{
      console.log("store.value.errors", store.value.errors)
      if (store.value.lastMessage){
        setGrabStatus("destroyed")
        return
      }
      if (store.value.errors.length > 0){
        setGrabStatus("failure")
        return
      }
    }, [store.value.errors])

    useEffect(()=>{
      switch(grabStatus){
        case 'destroyed':{
          toast({
            title: 'Félicitations !',
            description: `Le message ${receiptId} a bien été lu. Vous pouvez maintenant le copier/coller pour le conserver.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          return
        }
        case 'failure':{
          toast({
            title: 'Message introuvable',
            description: `Hmm, il semble que le message n'existe plus.`,
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
              {(grabStatus === "destroyed" || grabStatus === "failure" ) && <FormLabel flex={1}>Le message {receiptId} a bien été lu et n'est plus accessible.</FormLabel>}
              { grabStatus === "ready" && 
                <div style={{flex:1, gap:16, display: 'flex', justifyContent: 'space-between'}}>
                  <Button flex={1} colorScheme='teal' onClick={()=>grab()}>Oui je suis prêt !</Button>
                  <Button flex={1} colorScheme='gray'>Non pas encore</Button>
                </div>
              }
              { grabStatus === "destroyed" && store.value.lastMessage &&
                <>
                  <Textarea value={store.value.lastMessage.content} disabled backgroundColor={"Highlight"}  />
                </>
              }
          </FormControl>
}