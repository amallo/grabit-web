import { useMemo, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { FormControl, FormLabel, FormHelperText, Textarea, Button, Text, Input } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useStore } from './components/store.context';
import { useDropMessageViewModel } from './drop-message.viewmodel';

function App() {
  const store = useStore()
  const viewModel = useDropMessageViewModel(store)

  const copyToClipboard = ()=>{
    if (viewModel.lastReceipt){
      navigator.clipboard.writeText(viewModel.lastReceipt.id)
    }
  }
  return (
    <div className="App">
      <header className="App-header">
          <img src={logo} alt="logo" />
          <div style={{display: 'flex', flex: 1, gap: 16}}>
            <FormControl gap={16}>
              <FormLabel>Déposer un message privé</FormLabel>
              {!viewModel.lastReceipt &&<>
                <Textarea placeholder='Entrez ici votre message' onChange={((e)=>viewModel.enterAnonymousMessage(e.currentTarget.value))} />
                <FormHelperText>Votre message sera immédiatement détruit dès sa première lecture.</FormHelperText>
              </>
              }
              {viewModel.lastReceipt &&
              <Input type='text' readOnly value={`http://grabit.com/${viewModel.lastReceipt?.id}`}  backgroundColor={'gray'} />              
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
                  <Button leftIcon={<CopyIcon/>}  onClick={()=>copyToClipboard()}>Copier le lien</Button>
                }
                { viewModel.lastReceipt &&
                  <Button colorScheme='gray' onClick={()=>viewModel.zero()}>Déposer un autre message</Button>
                }
              </div>
            </FormControl>
          </div>
      </header>
    </div>
  );
}

export default App;
