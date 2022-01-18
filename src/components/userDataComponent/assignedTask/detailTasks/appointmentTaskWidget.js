import React, { useState, useEffect } from 'react'
import { showAlert } from '../../../my_alert_dlg/showAlertDlg';
import '../../style.css'
import { TASKTYPE } from '../enum_task';
import PlacesAutocomplete from './shared/PlacesAutocomplete';

function AppointmentTaskWidget(props) {
    const initValue = {
        task_name: "",
        task_dueDate: "",
        description: "",
        task_detail: {
            phone_number: "",
            address: ""
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
        if (infoDetails.task_dueDate === "") {
            showAlert({ content: "The due date can not be empty" });
            return false;
        }
        return true;
    }
    const submitTaskInfo = () => {
        if (validation() === false) return;
        onSubmitTask({
            ...infoDetails,
            type_id: TASKTYPE.appintment_scheduling,
            task_name: infoDetails.task_name,
            task_dueDate: infoDetails.task_dueDate,
            description: infoDetails.description,
            task_detail: {
                ...infoDetails.task_detail
            }
        }, isNew ? -1 : taskNo);
        setInfoDetails({ ...initValue });
    }
    console.log(" appointmnent infoDetails : ", infoDetails)
    return (
        <div className="add-input-section">
            {sameTaskUIList.length > 0 && <div>
                {sameTaskUIList}
                <div className="thin-line" style={{ marginBottom: 10 }} />
            </div>}

            <div className={isFromChat ? "row" : "input-row row"}>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Task Title"
                        value={infoDetails.task_name === undefined ? "" : infoDetails.task_name}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_name: e.target.value })}
                    />
                </div>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="mm/dd/yyyy"
                        type="date" style={{ color: infoDetails.task_dueDate === undefined || infoDetails.task_dueDate === "" ? "grey" : "black" }}
                        value={infoDetails.task_dueDate === undefined ? "" : infoDetails.task_dueDate}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_dueDate: e.target.value })}
                    />
                </div>
            </div>
            <div className={isFromChat ? "row" : "input-row row"}>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Phone Number"
                        value={infoDetails.task_detail.phone_number === undefined ? "" : infoDetails.task_detail.phone_number}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, phone_number: e.target.value } })}
                    />
                </div>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    {/* <input className="add-inputs" placeholder="Address"
                        value={infoDetails.task_detail.address === undefined ? "" : infoDetails.task_detail.address}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, address: e.target.value } })}
                    /> */}
                    {/* <GooglePlacesAutocomplete
                        apiKey="AIzaSyAfLIRT6KpzH73ykScFqIvJd3EXkL1qv8Y"
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

export default AppointmentTaskWidget
