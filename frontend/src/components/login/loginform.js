import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/appImages/logo_pa.png';
import * as Yup from 'yup';
import './loginform.css';
import { useAuth } from '../../context/authContext';
import { BASE_URL } from "../../apiCall";
import axios from 'axios';
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required').min(6),
});

const LoginForm = () => {
  const {login}   = useAuth();
  const history = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };


  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
       
      const response = await axios.post(`${BASE_URL}/auth/login`, { email: values.email, password: values.password });
      const { tokn, user } = response.data;
      await login(tokn, user);       
      history('/');
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.status === 401) {
        setErrors({ email: '', password: 'Verify your account please!' });
      }else if (error.response && error.response.status === 400) {
        setErrors({ email: '', password: 'Wrong email or password' });

      } else {
        setErrors({ email: '', password: 'Connection lost' });
      }
    }
    setSubmitting(false);
  };
  

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Sharing Code Platform</h3>
          <span className="loginDesc">
            Welcome to our community sharingCode with all your friends around the world
          </span>
          <img src={logo} alt="Logo" className="loginLogoImage" />
        </div>
        <div className="loginRight">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="loginBox">
                <div className="login-title">Sign In</div>
                <Field
                  type="email"
                  placeholder="Email"
                  name="email"
                  id="email"
                  className="loginInput"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
                <Field
                  type="password"
                  placeholder="Password"
                  className="loginInput"
                  name="password"
                  id="password"
                />
          
                <ErrorMessage name="password" component="div" className="error-message" />
                <button
                  className={isSubmitting ? "loginBtnDisabled" : "loginBtn"}
                  type="submit"
                  disabled={isSubmitting}
                >
                
                  {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </button>
                <button onClick={() => history('/register')} className="registerLoginBtn">
                       Don't have an account? Register
                </button>
                <button onClick={() => history('/forgotpassword')} className="forgotpassword">
                       Forgot Password ? Click here
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
