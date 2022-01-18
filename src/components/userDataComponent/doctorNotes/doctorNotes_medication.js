import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import './note_style.css'
function NoteMedication(props) {
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
    }, [medication, userInfo]);     // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div>
            <div className="note-medication-container">
                {chatMedication.map((item, i) =>
                    <div key={i} className="note-medication-every-data-card">
                        <p className="note-medication-subscription-title">{item.title}</p>
                        <p className="note-medication-subscription-description">{item.description}</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default NoteMedication
