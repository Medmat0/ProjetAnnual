import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/login/loginform'; 
import ForgotPasswordForm from './components/password/forgotpasswordform';
import ResetPasswordForm from './components/password/resetpasswordfrom';
import RegisterForm from './components/register/registerform'; 
import Profile from './components/profile/profile';
import ProtectedRoute from './protectedRoute';
import CodeEditor from './components/editor/editorform';
import Timeline from './components/timeline/timeline';
import EditProfile from './components/profile/editprofile';
import PipelineBuilder from './components/timeline/piplines/piplinesBuilder';

const resizeObserverLoopErrRe = /^ResizeObserver loop limit exceeded/;
const resizeObserverLoopErrHandler = (e) => {
    if (resizeObserverLoopErrRe.test(e.message)) {
        e.stopImmediatePropagation();
    }
};
window.addEventListener('error', resizeObserverLoopErrHandler);
function App() {    
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="code" element={<CodeEditor />} />
          <Route path="/pipline" element={<PipelineBuilder />} />
          <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
          <Route path="/resetpassword" element={<ResetPasswordForm />} />
          <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/editProfile/:userId" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
