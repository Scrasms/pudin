import { BrowserRouter, Routes, Route } from 'react-router';
import Landing from './pages/Landing';
import { ErrorProvider } from './contexts/ErrorProvider';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ErrorProvider>          
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </ErrorProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
