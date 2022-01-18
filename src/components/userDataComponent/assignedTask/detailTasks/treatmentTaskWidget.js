import React, { useState, useEffect } from 'react'
import { showAlert } from '../../../my_alert_dlg/showAlertDlg';
import '../../style.css'
import { TASKTYPE } from '../enum_task';
function TreatmentTaskWidget(props) {
    const initValue = {
        task_name: "",
        description: "",
        task_detail: {
            frequency: "",
            link: ""
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
            type_id: TASKTYPE.treatment_plan,
            task_name: infoDetails.task_name,
            description: infoDetails.description,
            task_detail: {
                ...infoDetails.task_detail
            }
        }, isNew ? -1 : taskNo);
        setInfoDetails({ ...initValue });
    }
    return (
        <div className="add-input-section">
            {sameTaskUIList.length > 0 && <div>
                {sameTaskUIList}
                <div className="thin-line" style={{ marginBottom: 10 }} />
            </div>}
            <div className={isFromChat === true ? "row" : "input-row row"}>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Task Title"
                        value={infoDetails.task_name === undefined ? "" : infoDetails.task_name}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_name: e.target.value })}
                    />
                </div>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Frequency"
                        value={infoDetails.task_detail.frequency === undefined ? "" : infoDetails.task_detail.frequency}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, frequency: e.target.value } })}
                    />
                </div>
            </div>
            <div className={isFromChat === true ? "row" : "input-row row"}>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Links to picture, video, etc."
                        value={infoDetails.task_detail.link === undefined ? "" : infoDetails.task_detail.link}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, link: e.target.value } })}
                    />
                </div>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <p>When adding multiple links,<br /> separate each with a comma</p>
                </div>
            </div>
            <div className={isFromChat === true ? "row" : "input-row row"}>
                <div className="col-7">
                </div>
                <div className={isFromChat ? "col-12" : "col-4"}>
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

export default TreatmentTaskWidget
