import React, { useState } from 'react';
import '../style.css';
import moment from 'moment'
import LabResultBody from '../labResult/labResultBody';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { server } from '../../../config/server';
// eslint-disable-next-line
import DoctorAssignedTask from './doctorAssignedTask/doctorAssignedTask';
import { showAlert } from '../../my_alert_dlg/showAlertDlg';
import AssignedTask from '../assignedTask/assignedTask';
import NoteMedication from './doctorNotes_medication';
import axios from '../../../api/axios';
const dateFormat = "YYYY-MM-DDThh:mm:ss"
export const DoctorNotesDetails = (props) => {
    const { homeUserName, setCreatedGroupId } = props;
    const { assignedTaskGroupId } = props;
    const { onSignNote, noteInfo, onCreateNewNote, onDiscardNote, onUpdateNote } = props;
    const userInfo = useSelector(state => state.patientSelect);
    const [data, setData] = useState(null);


    const [dataType, setDataType] = useState(null);
    const [healthData, setHealthData] = useState(null);
    const [detailsSection, setDetailsSection] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTest, setSelectedTest] = useState("");
    const [allData, setAllData] = useState(null);
    const [newNoteInfo, setNewNoteInfo] = useState({
        chief_complaint: "", HPI: "", Objective: "", physicalExam_Notes_general: "", physicalExam_General: "", physicalExam_Heent: "", physicalExam_Lungs: "", group_id: 0
    });
    // Toggle the details area
    const toggleDetailsSection = () => {
        setDetailsSection(detailsSection === false ? true : false);
    }

    const [assignedTaskGroup, setAssignedTaskGroup] = useState(undefined);

    useEffect(() => {
        console.log(" ------------------------- user updated ------------------------------");
        const fetchHealthData = () => {
            axios.get(server.serverURL + "v1/patient-lab-data/" + userInfo.id).then(({ data }) => {
                console.log("=== patient lab data response data ===", data)
                setData(data);
                const labData = data;
                axios.get(server.serverURL + "v1/healthkit-history?patient_id=" + userInfo.id).then(({ data }) => {
                    setHealthData(data);
                    setSelectedTest(Object.keys(data.data)[0]);
                    setDataType(0)
                    addObject(data, labData)
                }).catch(error => {
                    console.log("Error during fetch health history data === ", error);
                    setHealthData(null);
                    setSelectedTest("");
                    setDataType(0)
                    addObject(null, labData)
                });
            }).catch(error => {

            });

        };
        if (userInfo && userInfo.id) fetchHealthData();
    }, [userInfo]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (noteInfo !== null) {
            // console.log(noteInfo.group_id);
            if (noteInfo.group_id !== 0) getGroupInfo(noteInfo.group_id);
        }
    }, [props]);

    useEffect(() => {
        if (noteInfo === null) {
            if (assignedTaskGroupId === undefined) {
                // console.log("no task");
                setAssignedTaskGroup(undefined);
            } else {
                console.log("task availble", "Group ID: ", assignedTaskGroupId);
                setTimeout(() => {
                    getGroupInfo(assignedTaskGroupId)
                }, 3000);
            }
        }
    }, [assignedTaskGroupId]);  // eslint-disable-line react-hooks/exhaustive-deps

    const getGroupInfo = (groupId) => {
        // console.log(groupId);
        axios.get(server.serverURL + 'v1/task-group/' + groupId)
            .then((res) => {
                // console.log(res);
                var groupInfo = res.data.data;
                setAssignedTaskGroup({ ...groupInfo });
            })
            .catch((error) => {

            });
    }

    const addObject = (healthdata, labData) => {
        console.log(" healthdata ===> ", healthdata)
        console.log(" labData ===> ", labData)
        if (labData) {
            const allData = {
                healthData: healthdata,
                data: labData
            };
            console.log("allData ===> ", allData);
            setAllData(allData);
        }
    }

    // console.log("assignedTaskGroup ===>", assignedTaskGroup);
    // const onSubmitTaskGroup = async (groupName, taskList, isTemplate) => {
    //     console.log("group name", groupName)
    //     console.log("taskList", taskList);
    //     // console.log('isTemplate', isTemplate);
    //     if (taskList.length === 0) {
    //         await showAlert({ content: "You need to add at least one task." });
    //         return;
    //     }
    //     if (groupName === "" || groupName === undefined) {
    //         await showAlert({ content: "Please type the name of task set" });
    //         return;
    //     }
    //     updateGroup(groupName, taskList, isTemplate);
    // }

    // const updateGroup = async (groupName, taskList, isTemplate) => {
    //     console.log("assignedTaskGroup", assignedTaskGroup);
    //     console.log("userinfo", userInfo)
    //     const group_id = assignedTaskGroup.id;
    //     const patient_id = userInfo.id;
    //     for (var i = 0; i < taskList.length; i++) {
    //         var task = taskList[i];
    //         const taskParam = {
    //             ...task,
    //             patient_id: patient_id,
    //             task_group_id: group_id
    //         }
    //         console.log(taskParam)
    //         if (task.id !== "" && task.id !== undefined) {  // if already exist, update
    //             axios.put(server.serverURL + 'v1/tasks/' + task.id, taskParam, {
    //                 headers: {
    //                     'Authorization': 'Bearer ' + localStorage.token,
    //                     'Content-Type': 'application/json',
    //                 }
    //             }).then((res) => {
    //                 // console.log('updated')
    //             });
    //         } else {   // if new, create
    //             axios.post(server.serverURL + 'v1/tasks', taskParam, {
    //                 headers: {
    //                     'Authorization': 'Bearer ' + localStorage.token,
    //                     'Content-Type': 'application/json',
    //                 }
    //             }).then(res => {
    //                 console.log('added')
    //             });
    //         }
    //     }
    //     await showAlert({ content: "Successfully update the set of group !" });
    // }

    return (
        <React.Fragment>
            {
                detailsSection === true ?
                    <div className="doctors-notes-details-section">
                        {noteInfo === null || (noteInfo !== null && isEditing === true) ?
                            <div>
                                <div className="doctors-notes-details-section-header-row">
                                    <div>
                                        <p className="header-row-title">Add <span className="header-row-title">New Note</span></p>
                                    </div>
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Chief Complaint:</p>
                                    <input className="part-input-text-container part-input-text-style" placeholder="Type the complaint"
                                        value={newNoteInfo.chief_complaint} onChange={(e) => setNewNoteInfo({ ...newNoteInfo, chief_complaint: e.target.value })} />
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">HPI:</p>
                                    <input className="part-input-text-container part-input-text-style" placeholder="Type the complaint"
                                        value={newNoteInfo.HPI} onChange={(e) => setNewNoteInfo({ ...newNoteInfo, HPI: e.target.value })} />

                                    <div className="details-part-section" style={{ width: "100%" }}>
                                        <p className="parts-titles">Current Medications:</p>
                                        <p className="parts-decription-text" style={{ fontSize: 14, width: "100%" }}></p>
                                        <NoteMedication userInfo />
                                    </div>
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Objective:</p>
                                    <input className="part-input-text-container part-input-text-style" placeholder="Enter Objective"
                                        value={newNoteInfo.Objective} onChange={(e) => setNewNoteInfo({ ...newNoteInfo, Objective: e.target.value })} />
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Physical Exam:</p>
                                    <div className="description-row">
                                        {/* <span className="description-row-description">General, HEENT, Lungs:</span> */}
                                        <textarea className="details-part-description" placeholder="General, HEENT, Lungs:" value={newNoteInfo.physicalExam_Notes_general} onChange={(e) => setNewNoteInfo({ ...newNoteInfo, physicalExam_Notes_general: e.target.value })} ></textarea>
                                    </div>
                                    {/* <div className="description-row">
                                <p className="description-row-title" style={{ marginLeft: 50 }}>{"General:"}</p>
                                <input className="part-input-text-container part-input-text-style" placeholder="Type to enter General Text"
                                    value={newNoteInfo.physicalExam_General} onChange={(e) => setNewNoteInfo({ ...newNoteInfo, physicalExam_General: e.target.value })} />
                            </div>
                            <div className="description-row">
                                <p className="description-row-title" style={{ marginLeft: 50 }}>{"HEENT:"}</p>
                                <input className="part-input-text-container part-input-text-style" placeholder="Type to enter HEENT Text"
                                    value={newNoteInfo.physicalExam_Heent} onChange={(e) => setNewNoteInfo({ ...newNoteInfo, physicalExam_Heent: e.target.value })} />
                            </div>
                            <div className="description-row">
                                <p className="description-row-title" style={{ marginLeft: 50 }}>{"Lungs:"}</p>
                                <input className="part-input-text-container part-input-text-style" placeholder="Type to enter Lungs Text"
                                    value={newNoteInfo.physicalExam_Lungs} onChange={(e) => setNewNoteInfo({ ...newNoteInfo, physicalExam_Lungs: e.target.value })} />
                            </div> */}
                                </div>

                                <div className="details-part-section">
                                    <p className="parts-titles">Labs & Imaging:</p>
                                    <div className="doctors-note-details-available-lab-result-container">
                                        {/* <LabResultBody data={data}/> */}
                                        {
                                            allData &&
                                            <div>
                                                <div className="row">
                                                    <div className="col-12 col-sm-6">
                                                        <div className="lab-result-category-container">
                                                            {
                                                                Object.values(allData).map((category, id) => {
                                                                    console.log('allData ==>', allData);
                                                                    console.log('category ==>', category);
                                                                    return (
                                                                        <div key={id}>
                                                                            {
                                                                                Object.keys(category.data).map((cat, index) => {
                                                                                    console.log('cat =>', cat)
                                                                                    console.log(" category.data[cat].title :", category.data[cat].title)
                                                                                    return (<div
                                                                                        key={`lab_result_${index}`}
                                                                                        className="lab-result-category-button"
                                                                                        onClick={() => {
                                                                                            setDataType(id);
                                                                                            setSelectedTest(cat)
                                                                                        }}
                                                                                        style={{ background: selectedTest === cat ? "#f1effd" : "#F7F7FA" }}
                                                                                    >
                                                                                        <h4 className="round_head task_template_btn">
                                                                                            {category.data[cat].title} <span className="round_arrow-add-task">&gt;</span>
                                                                                        </h4>
                                                                                    </div>)
                                                                                })
                                                                            }
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        dataType === 0 &&
                                                        <div className="col-12 col-sm-6">
                                                            <div className="lab-result-description-section">
                                                                <div className="lab-result-description-card">
                                                                    <div className="title-section">
                                                                        <p className="title-text">{allData.healthData.data[selectedTest].title}</p>
                                                                        <p className="title-date-text">{allData.healthData.data[selectedTest].last_updated}</p>
                                                                    </div>
                                                                    {
                                                                        allData.healthData.data[selectedTest].details.map((detail, index) => {
                                                                            if (index === 0) {
                                                                                return (
                                                                                    <div key={`${allData.healthData.data[selectedTest].title}_${index}`}
                                                                                        className="description-row"
                                                                                    >
                                                                                        {
                                                                                            Object.entries(detail).map((visible, visIndex) => {
                                                                                                return (
                                                                                                    <div style={{ width: "33%" }}>
                                                                                                        <p className="description-row-title">{visible[0]}</p>
                                                                                                        <p className="description-row-info">
                                                                                                            <span>{visible[1]}</span>
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    <div key={`${allData.healthData.data[selectedTest].title}_${index}`}
                                                                                        className="description-row"
                                                                                    >
                                                                                        {
                                                                                            Object.entries(detail).map((visible, visIndex) => {
                                                                                                return (
                                                                                                    <div style={{ width: "33%" }}>
                                                                                                        <p className="description-row-info">
                                                                                                            <span>{visible[1]}</span>
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        dataType === 1 &&
                                                        <div className="col-12 col-sm-6">
                                                            <div className="lab-result-description-section">
                                                                <div className="lab-result-description-card">
                                                                    <div className="title-section">
                                                                        <p className="title-text">{allData.data.data[selectedTest].title}</p>
                                                                        <p className="title-date-text">{allData.data.data[selectedTest].date}</p>
                                                                    </div>
                                                                    {
                                                                        allData.data.data[selectedTest].details.map((detail, index) => {
                                                                            return (<div key={`${allData.data.data[selectedTest].title}_${index}`}
                                                                                className="description-row"
                                                                            >
                                                                                <p className="description-row-title">{detail.title}</p>
                                                                                <p className="description-row-info">
                                                                                    <span>{detail.amount}</span>
                                                                        &nbsp;{detail.unit}
                                                                                </p>
                                                                            </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    {
                                        !allData && <div className="doctors-note-details-part-description-card">
                                            <div className="title-section">
                                                <p className="title-text">No Lab Data available</p>
                                            </div>
                                        </div>
                                    }
                                </div>

                                <div className="details-part-section">
                                    <p className="parts-titles">Current Tasks:</p>

                                    <div className="doctors-note-details-part-task-detail-card-will-remove">
                                        <AssignedTask
                                            homeUserName={homeUserName} setCreatedGroupId={setCreatedGroupId}
                                            isFromNote={true} isAboveItem={true}
                                        />
                                    </div>
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Assessment & Plan:</p>
                                    <AssignedTask
                                        homeUserName={homeUserName} setCreatedGroupId={setCreatedGroupId}
                                        isFromNote={true} isAboveItem={false}
                                    />
                                    {/* <input className="part-input-text-container part-input-text-style" placeholder="Click here to start writing" /> */}
                                </div>

                                <div className="doctors-note-details-part-buttons-container">
                                    <div className="discard-button" onClick={() => {
                                        setNewNoteInfo({ chief_complaint: "", HPI: "", Objective: "", physicalExam_Notes_general: "", physicalExam_General: "", physicalExam_Heent: "", physicalExam_Lungs: "" });
                                        setDetailsSection(false);
                                    }}>
                                        <p className="doctor-notes-button-text">Discard</p>
                                    </div>
                                    <div className="primary-button"
                                        onClick={async () => {
                                            console.log("created")
                                            if (newNoteInfo.chief_complaint === "") {
                                                showAlert({ content: "Chief Complaint can not be empty." }); return
                                            }
                                            if (newNoteInfo.HPI === "") {
                                                showAlert({ content: "HPI can not be empty." }); return
                                            }
                                            if (newNoteInfo.physicalExam_Notes_general === "") {
                                                showAlert({ content: "Physical Exam can not be empty." }); return
                                            }
                                            // if (newNoteInfo.physicalExam_General === "") {
                                            //     showAlert({ content: "Physical Exam General can not be empty." }); return
                                            // }
                                            // if (newNoteInfo.physicalExam_Heent === "") {
                                            //     showAlert({ content: "Physical Exam HEENT can not be empty." }); return
                                            // }
                                            // if (newNoteInfo.physicalExam_Lungs === "") {
                                            //     showAlert({ content: "Physical Exam Lungs can not be empty." }); return
                                            // }
                                            if (newNoteInfo.Objective === "") {
                                                showAlert({ content: "Objective can not be empty." }); return
                                            }

                                            if (noteInfo === null) {
                                                await onCreateNewNote(newNoteInfo);
                                                setNewNoteInfo({ chief_complaint: "", HPI: "", Objective: "", physicalExam_Notes_general: "", physicalExam_General: "", physicalExam_Heent: "", physicalExam_Lungs: "" });
                                            } else {
                                                await onUpdateNote(newNoteInfo);
                                            }
                                            setDetailsSection(false);
                                        }}>
                                        <p className="doctor-notes-button-text">Save</p>
                                    </div>
                                    {/* <div className="primary-button">
                                <p className="doctor-notes-button-text">Sign</p>
                            </div> */}
                                </div>
                            </div>
                            :
                            <div>
                                <div className="doctors-notes-details-section-header-row">
                                    <div>
                                        <p className="header-row-title">Written by <span>{noteInfo.doctor_name}</span></p>
                                        <p className="header-row-date">{noteInfo.create_date}</p>
                                    </div>
                                    {noteInfo.is_sign !== 0 &&
                                        <div>
                                            <p className="header-row-title">Signed by <span>{noteInfo.doctor_name}</span></p>
                                            <p className="header-row-date">{moment(noteInfo.updated_at, dateFormat).format("YYYY-MM-DD hh:mm:ss")}</p>
                                        </div>
                                    }
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Chief Complaint:</p>
                                    <p className="parts-decription-text">{noteInfo.chief_complaint}</p>
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">HPI:</p>
                                    <p className="parts-decription-text">{noteInfo.HPI}</p>
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Objective:</p>
                                    <p className="parts-decription-text">{noteInfo.Objective}</p>
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Physical Exam:</p>
                                    <div className="doctors-note-details-part-description-card">
                                        <div className="description-row">
                                            <p className="description-row-title">{"General : "}</p>
                                            <p className="description-row-info"><span>{noteInfo.physicalExam_General}</span></p>
                                        </div>
                                        <div className="description-row">
                                            <p className="description-row-title">{"HEENT : "}</p>
                                            <p className="description-row-info"><span>{noteInfo.physicalExam_Heent}</span></p>
                                        </div>
                                        <div className="description-row">
                                            <p className="description-row-title">{"Lungs : "}</p>
                                            <p className="description-row-info"><span>{noteInfo.physicalExam_Lungs}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Labs & Imaging:</p>
                                    <div className="doctors-note-details-available-lab-result-container">
                                        <LabResultBody data={data} />
                                    </div>
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Current Tasks:</p>
                                    <div className="doctors-note-details-part-task-detail-card-will-remove">
                                        <AssignedTask
                                            homeUserName={homeUserName}
                                            setCreatedGroupId={setCreatedGroupId}
                                            isFromNote={true}
                                            isAboveItem={true}
                                        />
                                    </div>
                                </div>
                                <div className="details-part-section">
                                    <p className="parts-titles">Assessment & Plan:</p>
                                    <AssignedTask
                                        homeUserName={homeUserName}
                                        setCreatedGroupId={setCreatedGroupId}
                                        isFromNote={true}
                                        isAboveItem={false}
                                    />
                                    {/* <input className="part-input-text-container part-input-text-style" placeholder="Click here to start writing" /> */}
                                </div>
                                <div className="doctors-note-details-part-buttons-container">
                                    <div className="discard-button"
                                        onClick={() => setDetailsSection(false)}
                                    >
                                        <p className="doctor-notes-button-text">Discard</p>
                                    </div>
                                    <div className="primary-button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setDetailsSection(false);
                                        }}
                                    >
                                        <p className="doctor-notes-button-text">Save</p>
                                    </div>
                                    <div className="primary-button" onClick={noteInfo.is_sign === 0 ? () => onSignNote(noteInfo.doctor_note_id) : null}>
                                        {
                                            noteInfo.is_sign === 0
                                                ? <p className="doctor-notes-button-text" >Sign</p>
                                                : <p className="doctor-notes-button-text"><i className="fas fa-check"></i>Signed</p>
                                        }

                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    :
                    <div className="note-row row doctor-note-card">
                        <div style={{ width: "100%" }}>
                            <div className={noteInfo !== null ? "col-12 col-md-12 col-lg-6" : "col-12"} onClick={() => toggleDetailsSection()}>
                                <p className="assigned-task-text">{noteInfo === null ? "New Note" : noteInfo.doctor_name}</p>
                                <p className="subscribe-text">{noteInfo === null ? "" : noteInfo.create_date}</p>
                            </div>
                            {noteInfo !== null &&
                                <div className="col-12 col-md-12 col-lg-6" style={{ width: "100%" }}>
                                    <div className="row">
                                        <div className="col-12 col-sm-4">
                                            <div className="discard-button" onClick={() => onDiscardNote(noteInfo)} >
                                                <p className="doctor-notes-button-text">Discard</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="primary-button" onClick={() => {
                                                setNewNoteInfo({ ...noteInfo });
                                                setIsEditing(true);
                                                setDetailsSection(true);
                                            }}>
                                                <p className="doctor-notes-button-text">Edit</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="primary-button" onClick={noteInfo.is_sign === 0 ? () => onSignNote(noteInfo.doctor_note_id) : null}>
                                                <p className="doctor-notes-button-text">{noteInfo.is_sign === 0 ? "Sign" : "Signed"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
            }
        </React.Fragment>
    )
}
