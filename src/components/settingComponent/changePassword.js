import React from 'react';
import "./style.css";
import axios from 'axios';
import { server } from "../../config/server";
// import { useSelector } from 'react-redux';


export const ChangePassword = () => {
    const config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.token
        }
    }
    
    const onSubmitChangePassword = e =>{
        e.preventDefault();
        
        let passwordData = {
            "old_password": e.target["old_password"].value,
            "new_password": e.target["new_password"].value,
            "confirm_new_password": e.target["confirm_new_password"].value
        };
        axios.post(server.serverURL + 'v1/change-password', passwordData, config)
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
                <div className="setting-form change-password">
                    <h1>Change Password</h1>
                    <form className="change-password-form" onSubmit={onSubmitChangePassword}>
                        <div className="form-row active">
                            <input type="password" name="old_password" placeholder="Old Password"/>
                        </div>
                        <div className="form-row">
                            <input type="password" name="new_password" placeholder="New Password"/>
                        </div>
                        <div className="form-row">
                            <input type="password" name="confirm_new_password" placeholder="Confirm New Password"/>
                        </div>
                        <div className="form-row">
                            <input type="submit" value="Save"/>
                        </div>
                    </form>
                </div>
            </div>
    );
}