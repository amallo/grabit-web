import { FormControl, FormLabel, Textarea, Button, useToast, useClipboard } from "@chakra-ui/react"
import { useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import { CheckIcon, CopyIcon } from "@chakra-ui/icons"
import { useDispatch, useSelector } from "react-redux"
import { createGrabMessageViewModel } from "./grab-message.viewmodel"
import { AppDispatch } from "../../core/create-core.store"
export const GrabFormControl = ()=>{
    const {receiptId} = useParams()
    if (!receiptId){
      throw new Error("Receipt not defined")
    }

    const dispatch = useDispatch<AppDispatch>()
    const viewModel = useSelector(createGrabMessageViewModel({
      dispatch,
      depositId : receiptId
    }))
    const { onCopy, setValue, hasCopied } = useClipboard(viewModel.status === 'destroyed' ? viewModel.message : '', {timeout: 2000 })

    const grab = async ()=>{
      if (!receiptId){
        throw new Error("Receipt id not found")
      }
      return viewModel.grab()
    }

    const copyMessage = useCallback(()=>{
      if (viewModel.status !== "destroyed") return
      setValue(viewModel.message)
      onCopy()
    }, [viewModel.status, onCopy, setValue])


    useEffect(()=>{
      if (!receiptId){
        throw new Error("Receipt id not found")
      }
    }, [receiptId])

   
    useEffect(()=>{
      switch(viewModel.status){
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
    }, [viewModel.status])

    const toast = useToast()
    return <FormControl gap={16} flex={1}>
              {viewModel.status === "ready" && <FormLabel flex={1}>Lire et détruire le message {receiptId} ?</FormLabel>}
              {(viewModel.status === "destroyed" ) && <FormLabel flex={1}>Le message {receiptId} n'est désormais plus accessible.</FormLabel>}
              { viewModel.status === "ready" && 
                <div style={{flex:1, gap:16, display: 'flex', justifyContent: 'space-between'}}>
                  <Button flex={1} colorScheme='teal' onClick={()=>grab()}>Oui je suis prêt !</Button>
                  <Button flex={1} colorScheme='gray'>Non pas encore</Button>
                </div>
              }
              { viewModel.status === "destroyed" &&  
                <div style={{display: 'flex', flex:1, gap: 16, flexDirection: 'column'}}>
                  <Textarea style={{border: 0}} value={viewModel.message}   textColor={"black"} disabled backgroundColor={"azure"}  />
                  <Button leftIcon={hasCopied ? <CheckIcon/>: <CopyIcon/>}  onClick={()=>copyMessage()}>{hasCopied ? 'Copié !': 'Copier le message'}</Button>
                </div>
              }
          </FormControl>
}