import { BrowserRouter, Routes, Route } from 'react-router';
import Landing from './pages/Landing';
import { ErrorProvider } from './contexts/ErrorProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserProvider } from './contexts/UserProvider';
import AuthOnly from './components/AuthOnly';
import Dashboard from './pages/Dashboard';
import Book from './pages/Book';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ErrorProvider>
          <UserProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<AuthOnly />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/book/:bid" element={<Book />} />
              </Route>
            </Routes>
          </UserProvider>
        </ErrorProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
