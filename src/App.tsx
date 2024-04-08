import { useMemo, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { FormControl, FormLabel, FormHelperText, Textarea, Button, Text, Input } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useStore } from './components/store.context';
import { createDropMessageViewModel } from './drop-message.viewmodel';

function App() {
  const store = useStore()
  const [message, setMessage] = useState<string | null>(null)

  const [willDropMessage, setDroppedMessage] = useState<string | null>(null)
  const viewModel = useMemo(()=>createDropMessageViewModel(store), [])
  
  const refInputMessage = useRef<HTMLTextAreaElement>(null)
  const dropMessage = ()=>{
    if (message == null) return;
    viewModel.dropAnonymousMessage({content: message}).then(()=>{
      setDroppedMessage(message)
      setMessage(null)  
    })
  }
  const cancelMessage = ()=>{
    setMessage(null)  
    if (refInputMessage.current){
      refInputMessage.current.value = ""
    }
  }
  const restart = ()=>{
    setMessage(null)  
    if (refInputMessage.current){
      refInputMessage.current.value = ""
    }
    setDroppedMessage(null)
  }
  return (
    <div className="App">
      <header className="App-header">
          <img src={logo} alt="logo" />
          <div style={{display: 'flex', flex: 1, gap: 16}}>
            <FormControl gap={16}>
              <FormLabel>Déposer un message privé</FormLabel>
              {!willDropMessage &&<>
                <Textarea ref={refInputMessage} placeholder='Entrez ici votre message' onChange={((e)=>setMessage(e.currentTarget.value))} />
                <FormHelperText>Votre message sera immédiatement détruit dès sa première lecture.</FormHelperText>
              </>
              }
              {willDropMessage && viewModel.lastReceipt &&
              <Input type='text' readOnly value={`http://grabit.com/${viewModel.lastReceipt.value.id}`}  backgroundColor={'gray'} />              
              }
              
              {willDropMessage && 
              <FormHelperText color="GrayText" margin={0}>Vous pouvez envoyer ce lien dès maintenant à la personne de votre choix</FormHelperText>            
              }
              <div style={{display: 'flex', flex: 1, justifyContent: 'space-between', marginTop: 16 }}>
              { !willDropMessage &&
                <Button colorScheme='teal' onClick={()=> dropMessage()}>Déposer le message</Button>
              }
                { message &&
                  <Button colorScheme='gray' onClick={()=>cancelMessage()}>Annuler</Button>
                }
                { willDropMessage &&
                  <Button leftIcon={<CopyIcon/>}  onClick={()=>restart()}>Copier le lien</Button>
                }
                { willDropMessage &&
                  <Button colorScheme='gray' onClick={()=>restart()}>Déposer un autre message</Button>
                }
              </div>
            </FormControl>
          </div>
      </header>
    </div>
  );
}

export default App;
