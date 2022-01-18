// import userEvent from '@testing-library/user-event';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './style.css';

export const Medications = (props) => {
    const { userInfo } = props;
    const medication = useSelector(state => state.medication);
    const [chatMedication, setChatMedication] = useState([]);

    useEffect(() => {
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
        getMedicationData(medication);
    }, [medication, userInfo]);// eslint-disable-line react-hooks/exhaustive-deps

    // return <div className="chat-user-info-main-section" style={{ overflow: "hidden" }}>
    //     <div className="chat-user-info-row">
    //         <p className="chat-user-info-row-title">Age:</p>
    //         <p className="chat-user-info-row-description">{(userInfo ? userInfo.age : "")}</p>
    //     </div>
    //     <div className="chat-user-info-row">
    //         <p className="chat-user-info-row-title">D.O.B:</p>
    //         <p className="chat-user-info-row-description">{userInfo ? userInfo.DOB : ""}</p>
    //     </div>
    //     <div className="chat-user-info-row">
    //         <p className="chat-user-info-row-title">Allergies:</p>
    //         <p className="chat-user-info-row-description">{userInfo ? userInfo.allergies : ""}</p>
    //     </div>
    //     <div className="chat-user-info-row">
    //         <p className="chat-user-info-row-title">Medication:</p>
    //         <div className="chat-user-info-row-description">
    //             <div className="medication-row">
    //                 {chatMedication && chatMedication.map((item, i) =>
    //                     <p key={i} className="medication-row-text">{item}</p>
    //                 )}
    //             </div>
    //         </div>
    //     </div>
    // </div>
    return (
        <div className="medication-subscription-container">
            {medication.map((item, i) =>
                <div key={i} className="medication-every-data-card">
                    <div className="medication-between-part">
                        <p className="medication-subscription-title">{item.title}</p>
                        <p className="medication-subscription-description">{item.description}</p>
                    </div>
                    <div className="medication-between-part">
                        <p className="medication-subscription-author">{item.author}</p>
                        <p className="medication-subscription-date">{item.date}</p>
                    </div>
                </div>
            )}

        </div>
    )
}
