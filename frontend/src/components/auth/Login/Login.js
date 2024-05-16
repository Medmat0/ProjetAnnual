import React, {useEffect, useState} from "react";
import "./Login.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import TextError from "../TextError";
import useAuth from "../../../context/auth/AuthContext";
import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
import axios from "axios";

const initialValues = {
    email: "",
    password: "",
};

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required").min(6),
});

const Login = () => {
    const history = useHistory();
    const { user, loading, loginReq } = useAuth();
    const {error, setError} = useState("")

    const onSubmit = async (values) => {
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", values);
            console.log(response.data);
        } catch (error) {
            console.error("Error", error.response.data);
            setError(error.response?.data?.message || "Une erreur est survenuie lors de la connexion");
        }
    };

    useEffect(() => {
        if (user) {
            history.push("/");
        }
    }, [user, history]);

    return (
        <>
            <Helmet title="Se connecter" />
            <Toaster />
            <div className="login">
                <div className="loginWrapper">
                    <div className="loginLeft">
                        <h3 className="loginLogo">Splash Social</h3>
                        <span className="loginDesc">
              Plongez dans un monde de partage
            </span>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        enableReinitialize
                    >
                        <div className="loginRight">
                            <Form className="loginBox">
                                <div className="login-title">Sign In</div>
                                <Field
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    id="email"
                                    className="loginInput"
                                />
                                <ErrorMessage name="email" component={TextError} />
                                <Field
                                    type="password"
                                    placeholder="Password"
                                    className="loginInput"
                                    name="password"
                                    id="password"
                                />
                                <ErrorMessage name="password" component={TextError} />
                                <button
                                    className={loading ? "loginBtnDisabled" : "loginBtn"}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Log in"}
                                </button>
                                <button
                                    className="loginBtn"
                                    type="button"
                                    onClick={() =>
                                        onSubmit({
                                            email: "test@example.com",
                                            password: "123456",
                                        })
                                    }
                                >
                                    Get Test User credentials
                                </button>
                                <Link className="loginBtnCenter" to="/register">
                                    <button className="loginregistrationButton">Create a new account</button>
                                </Link>
                            </Form>
                        </div>
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default Login;
