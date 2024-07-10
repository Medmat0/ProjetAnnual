import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './resetpasswordform.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../apiCall";


const ResetPasswordForm = () => {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);
  const  history = useNavigate();
  const initialValues = {
    acessCode: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    acessCode: Yup.string().required('acess code is required'),
    password: Yup.string().required('Required').min(6),
    confirmPassword: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/auth/changepassword`, {
        password: values.password,
        acessCode: values.acessCode,
      });
      console.log(response.data);
      setResetSuccess(true);
      setResetError(null);
      history('/login');
    } catch (error) {
      console.error('Error:', error.response.data);
      setResetSuccess(false);
      setResetError(error.response.data.message);
    }
    setSubmitting(false);
  };

  return (
    
    <div className="login"> 
      <div className="loginWrapper"> 
        <div className="loginRight"> 
          <h2>Reset Password</h2> 
          {resetSuccess && <p className="success-message">Password reset successful!</p>}
          {resetError && <p className="error-message">{resetError}</p>}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="loginBox"> 
                <Field
                  type="text"
                  name="acessCode" 
                  placeholder="Access Code" 
                  className="loginInput" 
                />
                <ErrorMessage name="acessCode" component="div" className="error-message" />
                <Field
                  type="password"
                  name="password"
                  placeholder="New Password" 
                  className="loginInput" 
                />
                <ErrorMessage name="password" component="div" className="error-message" />
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password" 
                  className="loginInput" 
                />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={isSubmitting ? "loginBtnDisabled" : "loginBtn"} 
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
 

export default ResetPasswordForm;
