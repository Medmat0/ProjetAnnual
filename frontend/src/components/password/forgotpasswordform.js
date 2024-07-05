import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../apiCall";
import * as Yup from 'yup';
import axios from 'axios';
import './forgotpasswordform.css';
import toast from 'react-hot-toast';

const ForgotPasswordForm = () => {
  const history = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  const initialValues = {
    email: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
       await axios.post(`${BASE_URL}/auth/forgotpassword`, values);
      history('/resetpassword');
    } catch (error) {
    toast.error(error.response.data.error);
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
