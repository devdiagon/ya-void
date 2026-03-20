import { HashRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { UpdaterModal } from './components/Modal/UpdaterModal';

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <UpdaterModal />
      <RootLayout />
    </HashRouter>
  );
}

export default App;
