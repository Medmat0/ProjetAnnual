import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";

import Logout from "../pages/Logout";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Log from "../pages/Login";

const ProtectedRoute = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" exact component ={Log}/>
                <Route path="/logout" exact component ={Logout}/>
                <Route path="/profile" exact component ={Profile}/>
                <Route path="/register" exact component ={Register}/>

            </Switch>
        </Router>
    );
};

export default ProtectedRoute;