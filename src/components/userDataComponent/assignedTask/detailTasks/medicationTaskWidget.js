import clsx from 'clsx';
import React, { useState, useEffect } from 'react'
import axios from '../../../../api/axios';
import { server } from '../../../../config/server';
import { showAlert } from '../../../my_alert_dlg/showAlertDlg';
import '../../style.css'
import { TASKTYPE } from '../enum_task';

function MedicationTaskWidget(props) {
    const initValue = {
        task_name: "",
        description: "",
        task_detail: {
            strength: "",
            quantity: "",
            refill_number: "",
            dosage: "",
            frequency: "",
        }
    };
    const { initDetails, taskNo, isNew, onSubmitTask, tempTaskList, sameTaskUIList, isFromChat, pharmacyList } = props;
    console.log("pharmacyList : ", pharmacyList)
    // const isFromChat = true;
    const [cursor, setCursor] = useState(0);
    const [openMedicationName, setOpenMedicationName] = useState(true);
    const [openStrength, setOpenStrength] = useState(true);
    const [infoDetails, setInfoDetails] = useState({ ...initValue });
    const [drugStatement, setDrugStatement] = useState("");
    const [availableMedicationList, setAvailableMedicationList] = useState([]);
    const [availableStrengthList, setAvailableStrengthList] = useState([]);

    useEffect(() => {
        if (initDetails) {
            setInfoDetails({ ...initDetails });
            setDrugStatement("Take " + initDetails["task_detail"]["dosage"] + " by mouth " + initDetails["task_detail"]["frequency"]);
        }
    }, [initDetails]);

    const validation = () => {
        if (isNew && tempTaskList.filter(x => x.task_name === infoDetails.task_name).length > 0) {
            showAlert({ content: "The Title can not be duplicated" });
            return false;
        }
        if (infoDetails.task_name === "") {
            showAlert({ content: "The title can not be empty" });
            return false;
        }
        return true;
    }
    // const submitTaskInfo = () => {
    //     if (validation() === false) return;
    //     onSubmitTask({
    //         ...infoDetails,
    //         type_id: TASKTYPE.prescribe_medication,
    //         task_name: infoDetails.task_name,
    //         description: infoDetails.description,
    //         task_detail: {
    //             ...infoDetails.task_detail,
    //             dosage: "1 pill",
    //             frequency: "every 4 hours",
    //         }
    //     }, isNew ? -1 : taskNo);
    //     setInfoDetails({ ...initValue });
    // }

    const submitTaskInfo = () => {
        console.log(" Prescribe Medication Submit !!! ");
        const payload = {
            // label_text: "Take one tablet by mouth every 4 hours"
            label_text: drugStatement
        }

        // Take (dosage) by mouth every (frequency)
        if (validation() === false) return;
        if (!infoDetails.description) {
            showAlert({ content: "The description can not be empty" });
            return false;
        }
        axios.post("/v1/patient-medication/aws-comprehend", payload).then(({ data }) => {
            const resultArr = data.data;
            if (Array.isArray(resultArr) && resultArr.length >= 2) {
                const dosage = resultArr[0]["Text"];
                const frequency = resultArr[1]["Text"];

                onSubmitTask({
                    ...infoDetails,
                    type_id: TASKTYPE.prescribe_medication,
                    task_name: infoDetails.task_name,
                    description: infoDetails.description,
                    task_detail: {
                        ...infoDetails.task_detail,
                        dosage: dosage,
                        frequency: frequency,
                    }
                }, isNew ? -1 : taskNo);
                setInfoDetails({ ...initValue });
                setDrugStatement("");
            } else {
                showAlert({ content: "Drug statement is invalid." });
            }
        }).catch(err => {

        });
    }
    const onHandleInputMedicationName = (ev) => {
        const term = ev.target.value;
        console.log(" iiiiiiiiii term ", term)
        setInfoDetails({ ...infoDetails, task_name: term });
        if (term) {
            axios.get(`${server.domainURL}/nexpil/drug_product.php?Name=${term}&choice=0`).then(({ data }) => {
                console.log(" iiiiiiiiii data ", data)
                setAvailableMedicationList(data);
            }).catch(err => {

            });
        }
    }
    const handleKeyDown = (e) => {
        // arrow up/down button should select next/previous list element
        if (e.keyCode === 38 && cursor > 0) setCursor(cursor - 1);
        else if (e.keyCode === 40 && cursor < availableMedicationList.length - 1) setCursor(cursor + 1);
        else if (e.keyCode === 13) {
            setCursor(0);
            setOpenMedicationName(false);
            console.log("availableMedicationList[cursor] --- ", availableMedicationList[cursor]);
            const { DrugName } = availableMedicationList[cursor];
            setInfoDetails({ ...infoDetails, task_name: DrugName });
        }
    }
    useEffect(() => {
        if (infoDetails.task_name) {
            axios.get(`${server.domainURL}/nexpil/drug_product.php?name=${infoDetails.task_name}&choice=1`).then(({ data }) => {
                console.log(" ddddddddd ", data)
                const {
                    DrugName,
                    Form,
                    Strength
                } = data;
                setAvailableStrengthList(data.map(it => it.Strength));
            }).catch(err => {

            });
        }
    }, [infoDetails.task_name]);
    console.log("availableStrengthList: ", availableStrengthList);
    const onHandleInputStrength = (ev) => {
        const string = ev.target.value;
        setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, strength: string } })
    }
    return (
        <div className="add-input-section">
            {
                sameTaskUIList.length > 0 ?
                    <div>
                        {sameTaskUIList}
                        <div className="thin-line" style={{ marginBottom: 10 }} />
                    </div>
                    : null
            }
            <div className={isFromChat === true ? "row" : "input-row row"}>
                <div className={isFromChat === true ? "col-12 chat-patient-item-space" : "col-6"} >
                    <input className="add-inputs"
                        placeholder="Medication Name"
                        value={infoDetails.task_name ? infoDetails.task_name : ""}
                        onChange={onHandleInputMedicationName}
                        onKeyDown={handleKeyDown}
                    />
                    {
                        availableMedicationList.length > 0 && openMedicationName ?
                            <ul style={{
                                marginTop: "2px",
                                width: "95%",
                                position: "absolute",
                                background: "white",
                                borderRadius: "20px",
                                boxShadow: "0px 4px 8px #0000001a",
                                zIndex: "1000",
                                listStyleType: "none",
                                textAlign: "left",
                                overflowY: "auto",
                                paddingright: "1.5em"
                            }}>
                                {
                                    availableMedicationList.map((item, index) => {
                                        const {
                                            uuid,
                                            DrugName
                                        } = item;

                                        return (
                                            <li key={uuid}
                                                onClick={() => {
                                                    setInfoDetails({ ...infoDetails, task_name: DrugName });
                                                    setOpenMedicationName(false);
                                                }} style={{
                                                    cursor: "pointer",
                                                    background: "none",
                                                    color: cursor === index && "#4939E3"
                                                }}>
                                                <strong>{DrugName}</strong>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            : null
                    }
                </div>
                <div className={isFromChat === true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs"
                        placeholder="Strength"
                        value={infoDetails.task_detail.strength ? infoDetails.task_detail.strength : ""}
                        onChange={onHandleInputStrength}
                        onKeyDown={handleKeyDown}
                    />
                    {
                        availableStrengthList.length > 0 && openStrength ?
                            <ul style={{
                                marginTop: "2px",
                                width: "95%",
                                position: "absolute",
                                background: "white",
                                borderRadius: "20px",
                                boxShadow: "0px 4px 8px #0000001a",
                                zIndex: "1000",
                                listStyleType: "none",
                                textAlign: "left",
                                overflowY: "auto",
                                paddingright: "1.5em"
                            }}>
                                {
                                    availableStrengthList.map((item, index) => {
                                        return (
                                            <li key={index}
                                                onClick={() => {
                                                    setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, strength: item } });
                                                    setOpenStrength(false);
                                                }}
                                                style={{
                                                    cursor: "pointer",
                                                    background: "none",
                                                    color: cursor === index && "#4939E3"
                                                }}>
                                                <strong>{item}</strong>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            : null
                    }
                </div>
            </div>
            <div className={isFromChat === true ? "row" : "input-row row"}>
                <div className={isFromChat === true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs pr-3"
                        type="number"
                        placeholder="Quantity"
                        value={infoDetails.task_detail.quantity ? infoDetails.task_detail.quantity : ""}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, quantity: e.target.value } })}
                    />
                </div>
                <div className={isFromChat === true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs pr-3"
                        type="number"
                        placeholder="Number of Refills"
                        value={infoDetails.task_detail.refill_number ? infoDetails.task_detail.refill_number : ""}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, refill_number: e.target.value } })}
                    />
                </div>
            </div>
            <div className={isFromChat === true ? "row" : "input-row row"}>
                <div className="col-12 chat-patient-item-space">
                    <input className="add-inputs"
                        placeholder="Drug Statement: i.e. Take 1 pill by mouth every 8 hours."
                        value={drugStatement}
                        onChange={(e) => setDrugStatement(e.target.value)}
                    />
                </div>
            </div>



            <div className={clsx(isFromChat === true ? "row" : "input-row row", "d-none")}>
                <div className={isFromChat === true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs"
                        placeholder="Dosage"
                        value={infoDetails.task_detail.dosage ? infoDetails.task_detail.dosage : ""}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, dosage: e.target.value } })}
                    />
                </div>
                <div className={isFromChat === true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs"
                        placeholder="Frequency"
                        value={infoDetails.task_detail.frequency ? infoDetails.task_detail.frequency : ""}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, frequency: e.target.value } })}
                    />
                </div>
            </div>
            <div className={isFromChat === true ? "row" : "input-row row"}>
                <div className={isFromChat === true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <textarea
                        style={{ minHeight: "150px", padding: "20px" }} className="add-inputs" rows="4" cols="50"
                        value={infoDetails.description ? infoDetails.description : ""}
                        onChange={(e) => setInfoDetails({ ...infoDetails, description: e.target.value })}
                    />
                </div>
                <div className={isFromChat === true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <h3>Patient’s Preferred Pharmacy</h3>
                    <hr />
                    <div className="row col-12">
                        <div className="check_icon"><i className="fa fa-check"></i></div>
                        {
                            pharmacyList && pharmacyList.length > 0
                                ? <h5>{pharmacyList[0]['brand']}<br />{pharmacyList[0]['address']} </h5>
                                : <h5>No preferred Pharmacy</h5>
                        }
                        {/* <h4>CVS Pharmacy<br /> 208 W Washington St.<br /> Chicago, IL 60606</h4> */}
                    </div>
                </div>
            </div>

            <div className={isFromChat === true ? "row" : "input-row row"}>
                <div className="col-7">
                    <span className="task_input purplecol Medication_add_item_btn" style={{ cursor: "pointer" }}>
                        Add Item
                    </span>
                </div>
                <div className="col-4">
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

export default MedicationTaskWidget
