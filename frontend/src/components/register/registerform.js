import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logo from '../../assets/appImages/logo_pa.png';
import axios from 'axios';
import './registerform.css';
import TextError from './TextError'; 
import {  useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../apiCall";
import toast from "react-hot-toast";


  
 const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required').min(6),
  bio: Yup.string(),
  city: Yup.string(),
  confirmPassword: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const RegisterForm = () => {
  const history = useNavigate();
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, values);
      toast.success('Verify your email');
      history('/login');
    } catch (error) {
      console.error('Error:', error.response.data);
      if (error.response && error.response.data) {
        setErrors({ email: '', name: error.response.data.message });
      } else {
        toast.error('Connection lost');
      }
    }
    setSubmitting(false);
  };
  

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
            <h3 className="registerLogo">Sharing Code</h3>
            <span className="registerDesc">
            Welcome to our community SharingCode with all your friends around the world ! Join us now 😊
            </span>
            <img src={logo} alt="Logo" className="loginLogoImage" />

        </div>
        <div className="registerRight">
        <Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ isSubmitting }) => (
    <Form className="registerBox">
      <div className="register-title">Register</div>
      <Field
        type="text"
        name="name"
        id="name"
        placeholder="Username"
        className="registerInput"
      />
      <ErrorMessage name="name" component={TextError} />
      <Field
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        className="registerInput"

      />
      <ErrorMessage name="email" component={TextError} />
      <Field
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        className="registerInput"
      />
      <ErrorMessage name="password" component={TextError} />
      <Field
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm Password"
        className="registerInput"
      />
      <ErrorMessage name="confirmPassword" component={TextError} />
      <Field
        type="text"
        name="bio"
        id="bio"
        placeholder="Bio"
        className="registerInput"
      />
      <Field
        type="text"
        name="city"
        id="city"
        placeholder="City"
        className="registerInput"
      />
      <button
        type="submit"
        className={isSubmitting ? 'registerBtnDisabled' : 'registerBtn'}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing up...' : 'Sign up'}
      </button>
      <button onClick={() =>history('/login')} className="registerLoginBtn">
        Already have an account? Sign In
      </button>
      
    </Form>
  )}
</Formik>

        </div>   
      </div>
    </div>
  );
};

export default RegisterForm;
