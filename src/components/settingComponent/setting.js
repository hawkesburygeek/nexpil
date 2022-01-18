import React from 'react';
// import { useSelector } from 'react-redux';
import { ChangeEmail } from './changeEmail';
import { ChangePassword } from './changePassword';


import "./style.css";

export const Setting = () => {

    return (
        <div className="row col-12 m-0 my-auto">
            <div className="col-6 d-flex">
                <ChangeEmail />
            </div>
            <div className="col-6 d-flex">
                <ChangePassword />
            </div>
        </div>
    );
}
