import { CheckIcon, CopyIcon } from "@chakra-ui/icons"
import { FormControl, FormLabel, Textarea, FormHelperText, Input, Button, useClipboard, useToast, Box, Link } from "@chakra-ui/react"
import { useDropMessageViewModel } from "./drop-message.viewmodel"
import { useStore } from "../store.context"
import { useEffect } from "react"

const ErrorDescription = ()=>{
  return <span>Votre message n'a pas pu être envoyé. Vous pouvez réessayer ou nous contacter à <a style={{fontWeight: 'bold'}} href="contact@app2b.io">contact@app2b.io</a> si le problème persiste. On est là pour vous aider !</span>
}

export const DropFormControl = ()=>{
  const store = useStore()
  const viewModel = useDropMessageViewModel(store)
  const { onCopy, setValue, hasCopied } = useClipboard('', {timeout: 2000 })
  const toast = useToast()

  const copyToClipboard = ()=>{
      viewModel.copy()
      setValue(viewModel.clipboard)
      onCopy()
  }

  const retry = ()=>{
    viewModel.zero()
  }

  useEffect(()=>{
    if (!viewModel.hasError) {
      toast.closeAll()
      return;
    }
    toast({
      title: "Oups ! 🙈",
      description: <ErrorDescription/>,
      //description: `Votre message n'a pas pu être envoyé. Vous pouvez réessayer ou nous contacter à contact@app2b.io si le problème persiste. On est là pour vous aider !`,
      status: 'error',
      duration: 9000,
      isClosable: true,
      
    })
  }, [viewModel.hasError])

    return <FormControl gap={16}>
              <FormLabel>Déposer un message privé</FormLabel>
              {!viewModel.lastReceipt &&<>
                <Textarea 
                    placeholder={viewModel.hasError ? 'Prêt pour un nouvel essai ?' : 'Entrez ici votre message'}
                    value={viewModel.anonymousMessage} 
                    readOnly={viewModel.hasError}
                    borderColor={viewModel.hasError ? 'tomato' : undefined} 
                    onChange={((e)=>viewModel.enterAnonymousMessage(e.currentTarget.value))} />
                <FormHelperText>Votre message sera immédiatement détruit dès sa première lecture.</FormHelperText>
              </>
              }
              {viewModel.lastReceipt &&
              <Input type='text' readOnly value={`${viewModel.lastReceipt?.id}`}  backgroundColor={'gray'} />              
              }
              
              {viewModel.lastReceipt && 
              <FormHelperText color="GrayText" margin={0}>Vous pouvez envoyer ce lien dès maintenant à la personne de votre choix</FormHelperText>            
              }
              <div style={{display: 'flex', flex: 1, justifyContent: 'space-between', marginTop: 16 }}>
              { viewModel.canSubmit &&
                <Button colorScheme='teal' onClick={()=> viewModel.dropAnonymous()}>Déposer le message</Button>
              }
                { viewModel.canSubmit &&
                  <Button colorScheme='gray' onClick={()=>retry()}>Annuler</Button>
                }
                { viewModel.lastReceipt &&
                  <Button leftIcon={hasCopied ? <CheckIcon/>: <CopyIcon/>}  onClick={()=>copyToClipboard()}>{hasCopied ? 'Copié !': 'Copier le lien'}</Button>
                }
                { (viewModel.lastReceipt || viewModel.hasError) &&
                  <Button colorScheme='gray' onClick={()=>retry()}>Recommencer</Button>
                }
              </div>
            </FormControl>
}