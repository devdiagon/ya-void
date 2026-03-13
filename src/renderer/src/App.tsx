import { HashRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <RootLayout />
    </HashRouter>
  );
}

export default App;
