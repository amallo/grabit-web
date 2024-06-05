import { CheckIcon, CopyIcon } from "@chakra-ui/icons"
import { FormControl, FormLabel, Textarea, FormHelperText, Input, Button, useClipboard, useToast } from "@chakra-ui/react"
import { createDropMessageViewModel } from "./drop-message.viewmodel"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../core/create-core.store"

const ErrorDescription = ()=>{
  return <span>Votre message n'a pas pu être envoyé. Vous pouvez réessayer ou nous contacter à <a style={{fontWeight: 'bold'}} href="contact@app2b.io">contact@app2b.io</a> si le problème persiste !</span>
}

export const DropFormControl = ()=>{
  const dispatch = useDispatch<AppDispatch>();
  
  const { onCopy, setValue, hasCopied } = useClipboard('', {timeout: 2000 })
  const [content, setContent] = useState("")
  const toast = useToast()
  const viewModel = useSelector(createDropMessageViewModel({
    dispatch,
    content
  }))

  const copyToClipboard = ()=>{
      if (!viewModel.deposit) return
      setValue(viewModel.deposit)
      onCopy()
  }

  const retry = ()=>{
    setContent("")
  }

  useEffect(()=>{
    if (!viewModel.hasError) {
      toast.closeAll()
      return;
    }
    toast({
      title: "Oups ! 🙈",
      description: <ErrorDescription/>,
      status: 'error',
      duration: 9000,
      position: "top-right",
      isClosable: true,
      
    })
  }, [viewModel.hasError, toast])

    return <FormControl gap={16}>
              <FormLabel>Déposer un message privé</FormLabel>
              {!viewModel.deposit && <>
                <Textarea 
                    placeholder={viewModel.hasError ? 'Prêt pour un nouvel essai ? Cliquez sur Recommencer' : 'Entrez ici votre message'}
                    value={content} 
                    readOnly={viewModel.hasError}
                    borderColor={viewModel.hasError ? 'tomato' : undefined} 
                    onChange={((e)=>setContent(e.currentTarget.value))} />
                <FormHelperText>Votre message sera immédiatement détruit dès sa première lecture.</FormHelperText>
              </>
              }
              {viewModel.canCopyDepositToClipboard &&
              <Input type='text' readOnly value={`${viewModel.deposit}`}  backgroundColor={'gray'} />              
              }
              
              {viewModel.canCopyDepositToClipboard && 
              <FormHelperText color="GrayText" margin={0}>Vous pouvez envoyer ce lien dès maintenant à la personne de votre choix</FormHelperText>            
              }
              <div style={{display: 'flex', flex: 1, justifyContent: 'space-between', marginTop: 16 }}>
              { viewModel.canSubmit &&
                <Button colorScheme='teal' onClick={()=> viewModel.submit()}>Déposer le message</Button>
              }
                
                  <Button colorScheme='gray' onClick={()=>retry()}>Annuler</Button>
                
                { viewModel.canCopyDepositToClipboard &&
                  <Button leftIcon={hasCopied ? <CheckIcon/>: <CopyIcon/>}  onClick={()=>copyToClipboard()}>{hasCopied ? 'Copié !': 'Copier le lien'}</Button>
                }
              </div>
            </FormControl>
}