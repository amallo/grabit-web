import { CheckIcon, CopyIcon } from "@chakra-ui/icons"
import { FormControl, FormLabel, Textarea, FormHelperText, Input, Button, useClipboard } from "@chakra-ui/react"
import { useDropMessageViewModel } from "./drop-message.viewmodel"
import { useStore } from "../store.context"

export const DropFormControl = ()=>{
  const store = useStore()
  const viewModel = useDropMessageViewModel(store)
  const { onCopy, setValue, hasCopied } = useClipboard('', {timeout: 2000 })
  

  const copyToClipboard = ()=>{
      viewModel.copy()
      setValue(viewModel.clipboard)
      onCopy()
  }
    return <FormControl gap={16}>
              <FormLabel>Déposer un message privé</FormLabel>
              {!viewModel.lastReceipt &&<>
                <Textarea placeholder='Entrez ici votre message' onChange={((e)=>viewModel.enterAnonymousMessage(e.currentTarget.value))} />
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
                  <Button colorScheme='gray' onClick={()=>viewModel.zero()}>Annuler</Button>
                }
                { viewModel.lastReceipt &&
                  <Button leftIcon={hasCopied ? <CheckIcon/>: <CopyIcon/>}  onClick={()=>copyToClipboard()}>{hasCopied ? 'Copié !': 'Copier le lien'}</Button>
                }
                { viewModel.lastReceipt &&
                  <Button colorScheme='gray' onClick={()=>viewModel.zero()}>Déposer un autre message</Button>
                }
              </div>
            </FormControl>
}