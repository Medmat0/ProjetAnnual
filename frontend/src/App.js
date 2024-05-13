import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/login/loginform';
import RegisterForm from './components/register/registerform';
import ResetPasswordFrom from './components/password/resetpasswordform';
import ForgotPasswordForm from './components/password/forgotpasswordform';
import { AuthProvider } from './context/authContext'; 

function App() {
  return (
   <AuthProvider>
    <Router>
      <div>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
        <Route path="/resetpassword" element={<ResetPasswordFrom />} />
        <Route path="*" element={<h1>Page not found</h1>} />

      </Routes>
      </div>
    </Router>

   </AuthProvider>
  );
}

export default App;
