import React, { useState, useEffect } from 'react'
import { showAlert } from '../../../my_alert_dlg/showAlertDlg';
import '../../style.css'
import { TASKTYPE } from '../enum_task';
import PlacesAutocomplete from './shared/PlacesAutocomplete';


function ReferTaskWidget(props) {
    const initValue = {
        task_name: "",
        description: "",
        task_detail: {
            phone_number: "",
            address: "",
            comments: ""
        }
    };

    const { initDetails, taskNo, isNew, onSubmitTask, tempTaskList, sameTaskUIList, isFromChat } = props;
    const [infoDetails, setInfoDetails] = useState({ ...initValue });

    useEffect(() => {
        if (initDetails)
            setInfoDetails({ ...initDetails });
    }, [initDetails]);
    const validation = () => {
        if (isNew && tempTaskList.filter(x => x.task_name === infoDetails.task_name).length > 0) {
            showAlert({ content: "The Title can not be duplicated" });
            return false;
        }
        if (infoDetails.task_name === "") {
            showAlert({ content: "The title can not be empty" });
        }
        return true;
    }
    const submitTaskInfo = () => {
        if (validation() === false) return;
        onSubmitTask({
            ...infoDetails,
            type_id: TASKTYPE.refer_to_doctor,
            task_name: infoDetails.task_name,
            description: infoDetails.description,
            task_detail: {
                ...infoDetails.task_detail
            }
        }, isNew ? -1 : taskNo);
        setInfoDetails({ ...initValue });
    }

    console.log(" infoDetails ===> ", infoDetails)
    return (
        <div className="add-input-section">
            {sameTaskUIList.length > 0 && <div>
                {sameTaskUIList}
                <div className="thin-line" style={{ marginBottom: 10 }} />
            </div>}
            <div className={isFromChat ? "row" : "input-row row"}>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Doctor's Name"
                        value={infoDetails.task_name === undefined ? "" : infoDetails.task_name}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_name: e.target.value })}
                    />
                </div>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Phone Number"
                        value={infoDetails.task_detail.phone_number === undefined ? "" : infoDetails.task_detail.phone_number}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, phone_number: e.target.value } })}
                    />
                </div>
            </div>
            <div className={isFromChat ? "row" : "input-row row"}>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Comments"
                        value={infoDetails.task_detail.comments === undefined ? "" : infoDetails.task_detail.comments}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, comments: e.target.value } })}
                    />
                </div>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    {/* <input className="add-inputs" placeholder="Address"
                        value={infoDetails.task_detail.address ? infoDetails.task_detail.address : ""}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, address: e.target.value } })}
                    /> */}
                    <PlacesAutocomplete
                        address={infoDetails.task_detail.address ? infoDetails.task_detail.address : ""}
                        onChangeAddress={(value) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, address: value } })}
                    />
                </div>
            </div>

            <div className={isFromChat ? "row" : "input-row row"}>
                <div className="col-7">
                </div>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-4"}>
                    <button className="primary-button" onClick={submitTaskInfo}>
                        <p className="doctor-notes-button-text">
                            {isNew === true ? "Save Task" : "Update Task"}
                        </p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReferTaskWidget
