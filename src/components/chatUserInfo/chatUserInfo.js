import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './style.css';
// import { BsFillPlusCircleFill } from "react-icons/bs";
import AssignedTask from '../userDataComponent/assignedTask/assignedTask';
import axios from 'axios';
import { server } from "../../config/server";

// const virtualMedication = ["Calcitrol", "Ciprofloaxacin", "Glipizide", "Metformin", "Simvastatin"];


let token = localStorage.getItem("token");

export const ChatUserInfo = (selPatient) => {
    const userInfo = useSelector(state => state.chatUserSelect);
    const medication = useSelector(state => state.medication);
    // const allergy = useSelector(state => state.patientPersonalAllergy);
    // console.log(allergy);
    const [chatMedication, setChatMedication] = useState([]);
    const [allergy, setAllergy] = useState([]);
    // const userAssigedData = useSelector(state => state.assignedData);

   /*  console.log("userAggi", userAssigedData); */

    useEffect(() => {        
        getMedicationData(medication);
    }, [medication]);

    useEffect(() => {
        getMedicationData(medication);
        getAllergyData(selPatient);
        // console.log("userInfo", userInfo);
    }, [userInfo]);// eslint-disable-line react-hooks/exhaustive-deps

    const getMedicationData = (data) => {
        let array = [];
        if (data.length !== 0) {
            for (let index = 0; index < 4; index++) {
                const element = data[index];
                element ? array.push(element["title"]) : array.push("");
            }
            setChatMedication(array);
        } else {
            setChatMedication([]);
        }
    }
    const getAllergyData = async (ID) => {
        console.log(ID);
        let patient = {
            patientID: ID
        } 
        console.log(patient);
        var temp = await axios.post(server.serverURL + "v1/allergy", patient, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            setAllergy(response.data.data);
        });
    }

    return (
        <div className="chat-user-info-main-section" style={{ overflow: "hidden" }}>
            <div className="chat-user-info-row">
                <p className="chat-user-info-row-title">Age:</p>
                <p className="chat-user-info-row-description">{(userInfo ? userInfo.age : "")}</p>
            </div>
            <div className="chat-user-info-row">
                <p className="chat-user-info-row-title">D.O.B:</p>
                <p className="chat-user-info-row-description">{userInfo ? userInfo.DOB : ""}</p>
            </div>
            <div className="chat-user-info-row">
                <p className="chat-user-info-row-title">Allergies:</p>
                <div className="chat-user-info-row-description">
                    <div className="medication-row">
                        {allergy && allergy.map((item, i) =>
                            <p key={i} className="medication-row-text">{item['allergy_name']}</p>
                        )}
                    </div>
                </div> 
            </div>
            <div className="chat-user-info-row">
                <p className="chat-user-info-row-title">Medication:</p>
                <div className="chat-user-info-row-description">
                    <div className="medication-row">
                        {chatMedication && chatMedication.map((item, i) =>
                            <p key={i} className="medication-row-text">{item}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="chat-user-info-asigned-row">
                <p className="chat-user-info-row-title">Assigned Tasks:</p>
                {/* <BsFillPlusCircleFill size="20px" color="#4939E3" /> */}
                <div>
                    <AssignedTask
                        setCreatedGroupId={() => { }}
                        isFromChat={true}
                    />
                </div>
            </div>
            {/* {userAssigedData.map((item, i) =>
                <div key={i} className="chat-patient-page-existing-task-style">
                    <p className="chat-patient-page-existing-task-title-style">{item.name}</p>
                </div>
            )} */}
        </div>
    )
}
