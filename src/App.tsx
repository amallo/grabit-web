import { useMemo, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { FormControl, FormLabel, FormHelperText, Textarea, Button, Text, Input } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useStore } from './components/store.context';
import { createDropMessageViewModel } from './drop-message.viewmodel';
import { useAtom } from '@xoid/react';

function App() {
  const store = useStore()
  const $atom = createDropMessageViewModel(store)
  const viewModel = useAtom($atom)

  return (
    <div className="App">
      <header className="App-header">
          <img src={logo} alt="logo" />
          <div style={{display: 'flex', flex: 1, gap: 16}}>
            <FormControl gap={16}>
              <FormLabel>Déposer un message privé</FormLabel>
              {!viewModel.lastReceipt &&<>
                <Textarea placeholder='Entrez ici votre message' onChange={((e)=>$atom.actions.enterAnonymousMessage(e.currentTarget.value))} />
                <FormHelperText>Votre message sera immédiatement détruit dès sa première lecture.</FormHelperText>
              </>
              }
              {viewModel.lastReceipt &&
              <Input type='text' readOnly value={`http://grabit.com/${viewModel.lastReceipt.value.id}`}  backgroundColor={'gray'} />              
              }
              
              {viewModel.lastReceipt && 
              <FormHelperText color="GrayText" margin={0}>Vous pouvez envoyer ce lien dès maintenant à la personne de votre choix</FormHelperText>            
              }
              <div style={{display: 'flex', flex: 1, justifyContent: 'space-between', marginTop: 16 }}>
              { !viewModel.lastReceipt && viewModel.canSubmit &&
                <Button colorScheme='teal' onClick={()=> $atom.actions.dropAnonymous()}>Déposer le message</Button>
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
