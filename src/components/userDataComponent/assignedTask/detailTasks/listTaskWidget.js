import React, { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { showAlert } from '../../../my_alert_dlg/showAlertDlg';
import '../../style.css'
import { TASKTYPE } from '../enum_task';
function ListTaskWidget(props) {
    const initValue = {
        task_name: "",
        task_dueDate: "",
        description: "",
        task_detail: {
            items: [""],
            sequences: {
                medications_to_stop: "",
                items: []
            }
        }
    }
    const { initDetails, taskNo, isNew, onSubmitTask, tempTaskList, sameTaskUIList, isFromChat } = props;
    console.log(" ListTaskWidget props ==> ", props)
    const [infoDetails, setInfoDetails] = useState({ ...initValue });

    const [isSequenceData, setIsSequenceData] = useState(false);

    useEffect(() => {
        console.log("initDetails === >", initDetails)
        if (initDetails) {
            setInfoDetails({ ...initDetails });
            if (initDetails.task_detail) {
                if (initDetails.task_detail.items.length > 0) {
                    setIsSequenceData(false);
                } else {
                    setIsSequenceData(true);
                }
            }
        }
    }, [initDetails]);

    const toggleSequenceData = (val) => {
        if (val === false && infoDetails.task_detail.items.length === 0) {
            addNewItem(val);
        }
        if (val === true && infoDetails.task_detail.sequences.items.length === 0) {
            addNewItem(val);
        }
        setIsSequenceData(val);
    }

    const addNewItem = (val) => {
        var condition = isSequenceData;
        if (val !== undefined) {
            condition = val;
        }
        if (condition === false) {
            setInfoDetails({
                ...infoDetails,
                task_detail: {
                    ...infoDetails.task_detail,
                    items: [...infoDetails.task_detail.items, ""],
                }
            });
        }
        if (condition === true) {
            setInfoDetails({
                ...infoDetails,
                task_detail: {
                    ...infoDetails.task_detail,
                    sequences: {
                        ...infoDetails.task_detail.sequences,
                        items: [
                            ...infoDetails.task_detail.sequences.items,
                            { sequence_time: "", instruction: "" }
                        ]
                    }
                }
            });
        }
    }
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
            type_id: TASKTYPE.list,
            task_name: infoDetails.task_name,
            task_dueDate: infoDetails.task_dueDate,
            description: "",
            task_detail: !isSequenceData ?
                {
                    ...infoDetails.task_detail,
                    sequences: {
                        medications_to_stop: "",
                        items: []
                    }
                }
                :
                {
                    ...infoDetails.task_detail,
                    items: []
                }
        }, isNew ? -1 : taskNo);
        setInfoDetails({ ...initValue });
    }

    return (
        <div className="add-input-section">
            {
                sameTaskUIList.length > 0
                    ? <div>
                        {sameTaskUIList}
                        <div className="thin-line" style={{ marginBottom: 10 }} />
                    </div>
                    : null
            }
            {/* common header */}
            <div className="input-row row">
                <div className={isFromChat === true ? "col-12" : "col-6"} style={{ marginTop: 5 }}>
                    <input className="add-inputs" placeholder="Task Title"
                        value={infoDetails.task_name === undefined ? "" : infoDetails.task_name}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_name: e.target.value })}
                    />
                </div>

                <div className={isFromChat === true ? "col-12" : "col-6"} style={{ marginTop: 5 }}>
                    <input type="date" style={{ color: infoDetails.task_dueDate === undefined ? "grey" : "black" }}
                        className="add-inputs" placeholder="mm/dd/yyyy"
                        value={infoDetails.task_dueDate === undefined ? "" : infoDetails.task_dueDate}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_dueDate: e.target.value })}
                    />
                </div>
            </div>
            {/* particular items */}
            <div>
                {
                    isSequenceData ?
                        <div>
                            <div className="input-row row">
                                <div className={isFromChat === true ? "col-12" : "col-6"} style={{ marginTop: 5 }}>
                                    <TextareaAutosize className="add-inputs" placeholder="Medications To Stop"
                                        value={infoDetails.task_detail.sequences.medications_to_stop === undefined
                                            ? ""
                                            : infoDetails.task_detail.sequences.medications_to_stop}
                                        onChange={(e) => setInfoDetails({
                                            ...infoDetails,
                                            task_detail: {
                                                ...infoDetails.task_detail,
                                                sequences: {
                                                    ...infoDetails.task_detail.sequences,
                                                    medications_to_stop: e.target.value
                                                }
                                            }
                                        })}
                                    />
                                </div>
                                <div className={isFromChat === true ? "col-12" : "col-6"}>
                                </div>
                            </div>
                            {infoDetails.task_detail.sequences.items.map((item, index) => {
                                return <div key={`sequence_item_key_${index}`} className="input-row row">
                                    <div className={isFromChat === true ? "col-6" : "col-3"}>
                                        <TextareaAutosize className="add-inputs" placeholder={`Time`}
                                            type="time"
                                            value={item.sequence_time}
                                            onChange={(e) => {
                                                var details = infoDetails.task_detail.sequences.items;
                                                details[index] = { ...details[index], sequence_time: e.target.value, };
                                                setInfoDetails({
                                                    ...infoDetails,
                                                    task_detail: {
                                                        ...infoDetails.task_detail,
                                                        sequences: {
                                                            ...infoDetails.task_detail.sequences,
                                                            items: [...details]
                                                        }
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className={isFromChat === true ? "col-6" : "col-3"}>
                                        <TextareaAutosize className="add-inputs" placeholder={`Introduction #${index}`}
                                            value={item.instruction}
                                            onChange={(e) => {
                                                var details = infoDetails.task_detail.sequences.items;
                                                details[index] = { ...details[index], instruction: e.target.value, };
                                                setInfoDetails({
                                                    ...infoDetails,
                                                    task_detail: {
                                                        ...infoDetails.task_detail,
                                                        sequences: {
                                                            ...infoDetails.task_detail.sequences,
                                                            items: [...details]
                                                        }
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className={isFromChat === true ? "col-12" : "col-4"}></div>
                                </div>
                            })}
                        </div>
                        : infoDetails.task_detail.items.map((item, index) => {
                            return <div key={`no_sequence_item_key_${index}`} className="input-row row">
                                <div className={isFromChat === true ? "col-12" : "col-6"} style={{ marginTop: 5 }}>
                                    <TextareaAutosize className="add-inputs py-2" placeholder={`Checklist Item #${index}`}
                                        value={item || ""}
                                        onChange={(e) => {
                                            var details = infoDetails.task_detail.items;
                                            details[index] = e.target.value;

                                            setInfoDetails({
                                                ...infoDetails,
                                                task_detail: {
                                                    ...infoDetails.task_detail,
                                                    items: [...details],
                                                }
                                            });
                                        }}
                                    />
                                </div>
                                <div className={isFromChat === true ? "col-12" : "col-6"}></div>
                            </div>
                        })
                }
            </div>

            {/* add item button */}
            <div className="input-row row">
                <div className="col-10">
                    <span onClick={() => addNewItem(undefined)}
                        className="task_input purplecol Medication_add_item_btn" style={{ cursor: "pointer" }}>
                        Add Item
                    </span>
                </div>
                <div className="col-2">
                </div>
            </div>

            {/* toggle buttto to switch the sequence mode AND save button */}
            <div className="input-row row">
                <div className={isFromChat === true ? "col-12" : "col-7"}>
                    <div className="primary-button"
                        onClick={() => { toggleSequenceData(!isSequenceData) }}>
                        <p className="doctor-notes-button-text">
                            Show in sequence
                        </p>
                    </div>
                </div>
                <div className={isFromChat === true ? "col-12" : "col-4"} style={{ marginTop: 5 }}>
                    <button className="primary-button"
                        onClick={submitTaskInfo}>
                        <p className="doctor-notes-button-text">
                            {isNew === true ? "Save Task" : "Update Task"}
                        </p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ListTaskWidget
