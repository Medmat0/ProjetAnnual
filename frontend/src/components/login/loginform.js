import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import './loginform.css';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import toast from "react-hot-toast";

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
      login(values.email , values.password); 
      history('/');
    } catch (error) {
      
      if (error.code === "ERR_BAD_REQUEST") {
        console.error('Error during login:', error.code);
        setErrors({ email: '', password: 'No connection to the backend API.' });
        toast.error('No connection to the backend API.');
      }
      if (error.response && error.response.data) {
        setErrors({ email: '', password: error.response.data.message });
      
      } else {
        setErrors({ email: '', password: 'An error occurred during login.' });
        toast.error('No connection to the backend API.');
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
