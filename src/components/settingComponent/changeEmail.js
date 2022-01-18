import React from 'react';
import "./style.css";
import axios from 'axios';
import { server } from "../../config/server";
// import { useSelector } from 'react-redux';
export const ChangeEmail = () => {
    const config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.token
        }
    }
    const onSubmitChangeEmail = e =>{
        e.preventDefault();
        let emailData = {
            "old_email": e.target["old_email"].value,
            "new_email": e.target["new_email"].value,
            "confirm_new_email": e.target["confirm_new_email"].value
        };
        axios.post(server.serverURL + 'v1/change-email', emailData, config)
        .then(res => {
            alert(res.data.data.message);
        }).catch(function(err) {
            alert('Please check input.');
            if(err.response.status === '422'){
                console.log(err.response.data);
            }else{
                console.log(err.response.data);
            }
        });
        
    }
    return (
        <div className="setting-form-parent">
            <div className="setting-form change-email">
                <h1>Change Email</h1>
                <form className="change-email-form" onSubmit={onSubmitChangeEmail}>
                    <div className="form-row active">
                        <input type="email" name="old_email" placeholder="Old Email Address" />
                    </div>
                    <div className="form-row">
                        <input type="email" name="new_email" placeholder="New Email Address" />
                    </div>
                    <div className="form-row">
                        <input type="email" name="confirm_new_email" placeholder="Confirm New Email Address" />
                    </div>
                    <div className="form-row">
                        <input type="submit" value="Save" />
                    </div>
                </form>
            </div>
        </div>
        
    )
}