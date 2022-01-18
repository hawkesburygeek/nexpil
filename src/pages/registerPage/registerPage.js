import React, {useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import './style.css';
import { server } from "../../config/server";
import axios from 'axios';
import { useHistory } from "react-router-dom";
// import { BsLayoutSidebarReverse } from 'react-icons/bs';

export const RegisterPage = () => {
    const history = useHistory();
    // const [user, setUser] = useState()
    const [userStatus, setUserStatus] = useState(false)

    const FormHeader = props => (
        <h2 id="headerTitle">{props.title}</h2>
    );
        
    const FormPatient = props => {
        return (
            <form onSubmit={onPatientRegisterSubmit}>
                <FormInput name="firstName" description="First Name" placeholder="Enter your First Name" type="text" />
                <FormInput name="lastName" description="Last Name" placeholder="Enter your Last Name" type="text" />
                <FormInput name="birthday" description="Birthday" placeholder="Enter your Birthday" type="date" />
                <FormInput name="email" description="Email" placeholder="Enter your email" type="text" />
                <FormInput name="phone" description="Phone" placeholder="Enter your phone" type="number" />
                <FormInput name="password" description="Password" placeholder="Enter your password" type="password"/>
                <FormInput name="repassword" description="Reset" placeholder="Enter your password" type="password"/>
                <FormButton title="Sign Up"/>
            </form>
        )
    }

    const FormPhysician = props => {
        return (
            <form onSubmit={onPhysicianRegisterSubmit}>
                <FormInput name="firstName" description="First Name" placeholder="Enter your First Name" type="text" />
                <FormInput name="lastName" description="Last Name" placeholder="Enter your Last Name" type="text" />
                <FormInput name="birthday" description="Birthday" placeholder="Enter your Birthday" type="date" />
                <FormInput name="email" description="Email" placeholder="Enter your email" type="text" />
                <FormInput name="phone" description="Phone" placeholder="Enter your phone" type="number" />
                <FormButton title="Sign Up"/>
            </form>
        )
    }

    const onPatientRegisterSubmit = e => {
        e.preventDefault();
        let user = {
            "firstName": e.target["firstName"].value,
            "lastName": e.target["lastName"].value,
            "date_of_birth": e.target["birthday"].value,
            "phone_number": e.target["phone"].value,
            "email": e.target["email"].value,
            "password": e.target["password"].value,
            "password_confirmation": e.target["repassword"].value,
        };
        axios.post(server.serverURL + 'v1/patient', user)
        .then(res => {
            var data = res.data.data;
            if(data.status === true) {
                history.push("/");
            } else {
                alert("This user isn't registered user");
            }
        })
    }

    const onPhysicianRegisterSubmit = e => {
        e.preventDefault();
        let user = {
            "firstName": e.target["firstName"].value,
            "lastName": e.target["lastName"].value,
            "DOB": e.target["birthday"].value,
            "email": e.target["email"].value,
            "phone_number": e.target["phone"].value,
        };
        axios.post(server.serverURL + 'v1/physician-register', user)
        .then(res => {
            var data = res.data.data;
            if(data.status === true) {
                history.push("/");
            } else {
                alert("This user isn't registered user");
            }
        })
    }
    
    const FormButton = props => {
        return (
            <div id="button" className="row">
                <button type="submit">{props.title}</button>
            </div>
        );
    };
    
    const FormInput = props => (
        <div className="row">
            <label>{props.description}</label>
            <input name={props.name} type={props.type} placeholder={props.placeholder}/>
        </div>  
    );

    const handleUserStatus = () => {
        setUserStatus(!userStatus);
    }
    
    const OtherMethods = props => {
        return (
            <div id="alternativeLogin">
                <p> <label>You are Physician</label> <input  checked={userStatus} type="checkbox" onChange={handleUserStatus} /> </p>
                <p> <a href="login" >Login Here</a> </p>
                <label>Or sign in with:</label>
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

    return(
        <div id="loginform">
            <FormHeader title="Sign Up" />
            { userStatus === false &&
                <FormPatient />
            }
            { userStatus === true &&
                <FormPhysician />
            }
            <OtherMethods />
        </div>
    )
}

