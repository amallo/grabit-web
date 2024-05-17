import logo from './logo.svg';
import './App.css';
import { DropFormControl } from './components/messages/drop.form';

type Props = {
  children?: JSX.Element
}

function App(props: Props) {
  return (
    <div className="App">
      <header className="App-header">
          <img src={logo} alt="logo" />
          <div style={{display: 'flex', flex: 1, gap: 16}}>
            {props.children}
          </div>
      </header>
    </div>
  );
}

export default App;
