import React, { useState } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { server } from "../../config/server";
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from '../my_alert_dlg/showAlertDlg';
import { nanoid } from 'nanoid'

export const AddNewPatient = () => {
    const dispatch = useDispatch();
    const userRole = useSelector(state => state.userRole);
    // eslint-disable-next-line
    const [patientCode, setPatientCode] = useState("");
    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token,
            'Content-Type': 'application/json',
        }
    }

    const onPatientRegisterSubmit = e => {
        e.preventDefault();
        let user = {
            "first_name": e.target["firstName"].value,
            "last_name": e.target["lastName"].value,
            "phone_number": e.target["phone"].value,
            "email": e.target["email"].value,
        };
        if (userRole === "admin") {
            user.password = e.target["password"].value;
            user.password_confirmation = e.target["re-password"].value;
            user.date_of_birth = e.target["birthday"].value;
            // config.body = user;
            axios.post(server.serverURL + 'v1/physician-register', config)
                .then(res => {
                    var data = res.data.data;
                    sendWelcomeMessage(("+1" + user["phone_number"]));
                    console.log(data);
                    document.getElementById("patientCreateForm").reset();
                }).catch((e) => {
                    showAlert({ content: e.response.data.error });
                })
        } else {
            // config.body = user;
            user.date_of_birth = e.target["birthday"].value;
            console.log(" Payload 0 === ", user);
            axios.post(server.serverURL + 'v1/patients', user, config)
                .then(res => {
                    var data = res.data.data;
                    console.log(" Responase 0 === ", res.data);
                    var patient_info = data.patient_info;
                    const {
                        id,
                        user_id,
                        usertype,
                        DOB,
                        email,
                        first_name,
                        last_name,
                        phone_number,
                        created_at,
                        updated_at,
                    } = data.patient_data;

                    const payload = {
                        id,
                        user_id,
                        DOB,
                        address: null,
                        age: "",
                        chat_date: "",
                        chat_date_time: 0,
                        city: "",
                        diagnosis: "",
                        first_name,
                        last_name,
                        patient_name: first_name + " " + last_name,
                        phone_number,
                        recent_chat: "",
                        selected: false,
                        state: "",
                        street_address: "",
                        zip: "",
                        zipcode: "",
                        userimage: "https://twilio.nexp.xyz/storage/upload/profile/no-image.jpeg",
                    }
                    dispatch({ type: "ADD_TO_PATIENTS_LIST", payload });
                    sendWelcomeMessage((patient_info));
                    document.getElementById("patientCreateForm").reset();
                }).catch((e) => {
                    showAlert({ content: e.response.data.error });
                })
        }
    }
    // eslint-disable-next-line
    const dataValidation = (data) => {
        for (var index in data) {
            if (data[index] === "") {
                return false
            }
        }
        return true;
    }

    const sendWelcomeMessage = (patient_info) => {
        axios.post(server.serverURL + 'v1/sms-send', {
            "patient_id": patient_info.patient_id,
            "message": "Welcome to Nexpil. Download our app to get started.\n Click the link to complete your setup.\n " + patient_info.code_link,
        }, config)
            .then(res => {
                var data = res.data;
                if (data.data.status === "success") {
                    showAlert({ content: "the code was sent successfully to the patient" });
                }
            }).catch((e) => {

                showAlert({ content: e.response.data.error });
            })
    }
    // eslint-disable-next-line
    const sendCodeMessage = (phone) => {
        axios.post(server.serverURL + 'v1/sms-send', {
            "to": phone,
            "body": "<a href='nexpil://" + (nanoid()).slice(0, 8) + "'>Complete setup</a>"
        }, config)
            .then(res => {
                var data = res.data;
                console.log(data);
                if (data.data === "success") {
                    showAlert({ content: "the code was sent successfully to the patient" });

                }
            });
    }

    return (
        <form className="card-section onPatientRegisterSubmit" onSubmit={onPatientRegisterSubmit} id="patientCreateForm">
            <div>
                <h1>Add Patients</h1>
                <div className="add-input-description">Enter your patient's full name, email address and phone number below</div>
                <div className="add-input-description">and we'll send them a unique code they can use to sign in.</div>
            </div>
            <div className="add-input-section">
                <div className="input-row row">
                    <div className="col-6">
                        <input name="firstName" className="add-inputs" placeholder="First Name" />
                    </div>
                    <div className="col-6">
                        <input name="lastName" className="add-inputs" placeholder="Last Name" />
                    </div>
                </div>
                <div className="input-row row">
                    <div className="col-4">
                        <input name="birthday" type="date" className="add-inputs" placeholder="Date of Birth" />
                    </div>
                    <div className="col-4">
                        <input name="email" type="email" className="add-inputs" placeholder="Email Address" />
                    </div>
                    <div className="col-4">
                        <input name="phone" type="number" className="add-inputs" placeholder="Cell Phone" />
                    </div>
                </div>
                {userRole === "admin" &&
                    <div className="input-row row">
                        <div className="col-6">
                            <input name="password" type="password" className="add-inputs" placeholder="Enter Password" />
                        </div>
                        <div className="col-6">
                            <input name="re-password" type="password" className="add-inputs" placeholder="Confirm Password" />
                        </div>
                    </div>
                }
                <div className="input-row">
                    {userRole !== "admin" &&
                        <div className="col-12">
                            <button type="submit" className="add-button" >Add Patient</button>
                        </div>
                    }
                    {userRole === "admin" &&
                        <button type="submit" className="add-button" >Add Physician</button>
                    }
                </div>
            </div>
        </form>
    )
}
