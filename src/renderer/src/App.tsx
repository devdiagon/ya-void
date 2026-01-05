import { BrowserRouter } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <RootLayout />
    </BrowserRouter>
  );
}

export default App
