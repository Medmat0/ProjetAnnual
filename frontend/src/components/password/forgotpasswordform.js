import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../apiCall";
import * as Yup from 'yup';
import axios from 'axios';
import './forgotpasswordform.css';

const ForgotPasswordForm = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  const initialValues = {
    email: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/forgotpassword`, values);
      setSuccessMessage(response.data.message);
      history('/resetpassword');
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
    setSubmitting(false);
  };

  return (
    
    <div className="login">
      <div className="loginWrapper">
        <div className="loginRight">
          <h2>Forgot Password</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="loginBox">
                <Field
                  type="email"
                  placeholder="Email"
                  name="email"
                  id="email"
                  className="loginInput"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
                <button
                  className={isSubmitting ? "loginBtnDisabled" : "loginBtn"}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );

  
};

export default ForgotPasswordForm;
