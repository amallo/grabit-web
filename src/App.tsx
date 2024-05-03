import logo from './logo.svg';
import './App.css';
import { DropFormControl } from './components/messages/drop.form';

type Form = "grab" | "drop"
function App() {
  /*const [form, setForm] = useState<Form>("grab")

  useEffect(()=>{
    const searchParams = new URLSearchParams(window.location.search);
    const op: Form = searchParams.get('op') as Form;
    setForm(op)
  }, [window.location.search])*/

  return (
    <div className="App">
      <header className="App-header">
          <img src={logo} alt="logo" />
          <div style={{display: 'flex', flex: 1, gap: 16}}>
            <DropFormControl/>
          </div>
      </header>
    </div>
  );
}

export default App;
