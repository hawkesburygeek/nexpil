import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './style.css';
import { server } from "../../config/server";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { USER_ROLE_SET } from '../../store/actionNames';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export const LoginPage = () => {
    const dispatch = useDispatch();

    const usernameRef = React.useRef();
    const passwordRef = React.useRef();
    const history = useHistory();

    useEffect(() => {
        const checkUserToken = () => {
            var token = localStorage.getItem("token");
            if (!token) {
                history.push("/login");
            } else if (token) {
                window.location.href = '/calendar';
                // history.push("/calendar");
                // window.location.href = '/calendar';
            }
        };
        checkUserToken();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps



    const FormHeader = props => (
        <h2 className="form-header">{props.title}</h2>
    );

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            onLoginClick();
        }
    }

    const Form = props => {
        return (
            <div className="input-form">
                <label className="greeting">Hi there!</label>
                <div>
                    <input onKeyDown={handleEnter} ref={usernameRef} type="text" placeholder="Email address" className="login-form" />
                    <input onKeyDown={handleEnter} ref={passwordRef} type="password" placeholder="Password" className="login-form"/>
                    {/* <TextField onKeyDown={handleEnter} ref={usernameRef} id="filled-basic" label="Email address" variant="filled" className="login-form" />
                    <TextField onKeyDown={handleEnter} ref={passwordRef} id="filled-basic" label="Password" variant="filled" className="login-form" /> */}
                </div>
                <label className="forgot">Forgot Password?</label>
                <div class="log-button">
                    <button className="login-btn" onClick={onLoginClick}>{props.title}</button>
                </div>
                {/* <div className="login-row">
                    <label>Username</label>
                    <input onKeyDown={handleEnter} ref={usernameRef} type="text" placeholder="Enter your username" />
                </div>
                <div className="login-row">
                    <label>Password</label>
                    <input onKeyDown={handleEnter} ref={passwordRef} type="password" placeholder="Enter your password" />
                </div>
                <div id="button" className="login-row">
                    <button onClick={onLoginClick}>{props.title}</button>
                </div> */}
            </div>
        )
    }

    const onLoginClick = (event) => {
        if (!usernameRef.current.value || !passwordRef.current.value) {
            alert("Enter Username or Password");
            return false;
        }
        var user = {
            email: usernameRef.current.value,
            password: passwordRef.current.value
        }
        axios.post(server.serverURL + 'v1/login', user)
            .then(res => {
                var data = res.data.data;
                console.log(data)
                if (data.access_token) {
                    axios.defaults.headers.common['Authorization'] = "Bearer " + data.access_token;
                    localStorage.setItem("token", data.access_token);
                    localStorage.setItem("userName", data.user_info.name);
                    localStorage.setItem("userImage", data.user_info.userimage);
                    localStorage.setItem("userId", data.user_info.id);
                    localStorage.setItem("profileDescription", data.user_info.profile_description);
                    dispatch({ type: "USER_INFO_SET", payload: data.user_info });
                    if (localStorage.token) {
                        if (data.role_id === 1) {
                            localStorage.setItem("userRole", "admin");
                            dispatch({ type: USER_ROLE_SET, payload: "admin" });
                        } else {
                            localStorage.setItem("userRole", "user");
                            dispatch({ type: USER_ROLE_SET, payload: "user" });
                        }
                        window.location.href = '/calendar';
                    }
                } else {
                    alert("This user isn't registered user");
                }
            })
    }
    // eslint-disable-next-line
    const OtherMethods = props => {
        return (
            <div id="alternativeLogin">
                <label>Forgot Password</label>
                <div id="iconGroup">
                    <Facebook />
                    <Twitter />
                    <Google />
                </div>
            </div>
        );
    };

    const Facebook = props => (
        // eslint-disable-next-line
        <a href="#" id="facebookIcon"></a>
    );

    const Twitter = props => (
        // eslint-disable-next-line
        <a href="#" id="twitterIcon"></a>
    );

    const Google = props => (
        // eslint-disable-next-line
        <a href="#" id="googleIcon"></a>
    );

    return (
        // <div className="page-main-container" id="loginform">
        //     <FormHeader title="Nexpil" />
        //     <Form title="Login" />
        //     {/* <OtherMethods /> */}
        // </div>
        <div>
            <div className="login-section justify-content-center">
                <div><img src="assets/images/login-logo.png" className="form-header" width="200" height="58" /></div>
                <Form title="LOGIN"></Form>
            </div>
        </div>
    )
}

