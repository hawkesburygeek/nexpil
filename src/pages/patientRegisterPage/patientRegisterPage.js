import React, {useState} from 'react';
import './style.css';
import { useHistory } from "react-router-dom";

export const PatientRegisterPage = () => {
    const history = useHistory();
    const [user, setUser] = useState()
    const form = React.useRef();

    const FormHeader = props => (
        <h2 id="headerTitle">{props.title}</h2>
    );
        
    const Form = props => {
        return (
            <form ref={form} onSubmit={onRegisterSubmit}>
                <FormInput name="firstName" description="First Name" placeholder="Enter your First Name" type="text" />
                <FormInput name="lastName" description="Last Name" placeholder="Enter your Last Name" type="text" />
                <FormInput name="birthday" description="Birthday" placeholder="Enter your Birthday" type="date" />
                <FormInput name="email" description="Email" placeholder="Enter your email" type="text" />
                <FormInput name="phone" description="Phone" placeholder="Enter your phone" type="number" />
                <FormButton title="Add Another Patient"/>
                <FormButton title="Send Code"/>
            </form>
        )
    }

    const onRegisterSubmit = e => {
        e.preventDefault();
        let user = {
            "firstName": e.target["firstName"].value,
            "lastName": e.target["lastName"].value,
            "birthday": e.target["birthday"].value,
            "email": e.target["email"].value,
            "phone": e.target["phone"].value,
        };
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
    
    return(
        <div id="loginform">
        <FormHeader title="Add New Patient" />
        <Form />
      </div>
    )
}

