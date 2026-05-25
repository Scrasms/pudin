import { BrowserRouter, Routes, Route } from 'react-router';
import Landing from './pages/Landing';
import { ErrorProvider } from './contexts/ErrorProvider';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ErrorProvider>          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Landing />} />
          </Routes>
        </ErrorProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
