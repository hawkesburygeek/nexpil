import React, { useState } from 'react';
import '../style.css';
import moment from 'moment'
import LabResultBody from '../labResult/labResultBody';
import { useEffect } from 'react';
import { server } from '../../../config/server';
import axios from 'axios';
import DoctorAssignedTask from './doctorAssignedTask/doctorAssignedTask';
import { showAlert } from '../../my_alert_dlg/showAlertDlg';
const dateFormat = "YYYY-MM-DDThh:mm:ss"
export const DoctorNotesDetails = (props) => {
    const { assignedTaskGroupId, userInfo } = props;
    const { onSignNote, noteInfo, onCreateNewNote, onDiscardNote, onUpdateNote } = props;

    const [detailsSection, setDetailsSection] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [newNoteInfo, setNewNoteInfo] = useState({
        chief_complaint: "", HPI: "", Objective: "", physicalExam_General: "", physicalExam_Heent: "", physicalExam_Lungs: "", group_id: 0
    });
    // Toggle the details area
    const toggleDetailsSection = () => {
        setDetailsSection(detailsSection === false ? true : false);
    }

    const [assignedTaskGroup, setAssignedTaskGroup] = useState(undefined);

    useEffect(() => {
        if (noteInfo !== null) {
            // console.log(noteInfo.group_id);
            if (noteInfo.group_id !== 0) {

                getGroupInfo(noteInfo.group_id)
            }
        }
    }, [noteInfo]);

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
    }, [assignedTaskGroupId]);

    const getGroupInfo = (groupId) => {
        // console.log(groupId);
        axios.get(server.serverURL + 'v1/task-group/' + groupId, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token,
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                // console.log(res);
                var groupInfo = res.data.data;
                setAssignedTaskGroup({ ...groupInfo });
            })
            .catch((error) => {

            })
    }
    // console.log("assignedTaskGroup", assignedTaskGroup);

    const onSubmitTaskGroup = async (groupName, taskList, isTemplate) => {
        console.log("group name", groupName)
        console.log("taskList", taskList);
        // console.log('isTemplate', isTemplate);
        if (taskList.length === 0) {
            await showAlert({ content: "You need to add at least one task." });
            return;
        }
        if (groupName === "" || groupName === undefined) {
            await showAlert({ content: "Please type the name of task set" });
            return;
        }

        updateGroup(groupName, taskList, isTemplate);
    }
    const updateGroup = async (groupName, taskList, isTemplate) => {
        console.log("assignedTaskGroup", assignedTaskGroup);
        console.log("userinfo", userInfo)
        const group_id = assignedTaskGroup.id;
        const patient_id = userInfo.id;
        for (var i = 0; i < taskList.length; i++) {
            var task = taskList[i];
            const taskParam = {
                ...task,
                patient_id: patient_id,
                task_group_id: group_id
            }
            console.log(taskParam)
            if (task.id !== "" && task.id !== undefined) {  // if already exist, update
                axios.put(server.serverURL + 'v1/tasks/' + task.id, taskParam, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.token,
                        'Content-Type': 'application/json',
                    }
                }).then((res) => {
                    // console.log('updated')
                });
            } else {   // if new, create
                axios.post(server.serverURL + 'v1/tasks', taskParam, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.token,
                        'Content-Type': 'application/json',
                    }
                }).then(res => {
                    console.log('added')
                });
            }
        }
        await showAlert({ content: "Successfully update the set of group !" });
    }

    return (
        <>
            {detailsSection === false &&
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

            {detailsSection === true &&
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

                                <div className="details-part-section" style={{ marginLeft: 50, width: "100%" }}>
                                    <p className="parts-titles">Current Medications:</p>
                                    <p className="parts-decription-text" style={{ fontSize: 14, width: "100%" }}>{"This should auto populate from the medication section above"}</p>
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
                                </div>
                            </div>

                            <div className="details-part-section">
                                <p className="parts-titles">Labs & Imaging:</p>
                                <div className="doctors-note-details-available-lab-result-container">
                                    <LabResultBody />
                                </div>
                                {/* <div className="doctors-note-details-part-description-card">
                                    <div className="title-section">
                                        <p className="title-text">No Lab Data available</p>
                                    </div>
                                </div> */}
                            </div>

                            <div className="details-part-section">
                                <p className="parts-titles">Current Tasks:</p>
                                {assignedTaskGroup === undefined
                                    ? (<div className="doctors-note-details-part-description-card">
                                        <div className="title-section" style={{ width: "1005" }}>
                                            <p className="title-text">No Task available</p>
                                        </div>
                                    </div>) :
                                    <div className="doctors-note-details-part-task-detail-card">
                                        <DoctorAssignedTask
                                            isNew={assignedTaskGroup === "" || assignedTaskGroup === undefined}
                                            setVisibleBody={() => { }}
                                            selectedGroup={assignedTaskGroup}
                                            taskTemplateList={[]}
                                            onSubmitTaskGroup={onSubmitTaskGroup}
                                            setSelectedGroup={() => { }}
                                            setIsLoading={() => { }}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="details-part-section">
                                <p className="parts-titles">Assessment & Plan:</p>
                                <input className="part-input-text-container part-input-text-style" placeholder="Click here to start writing" />
                            </div>

                            <div className="doctors-note-details-part-buttons-container">
                                <div className="discard-button" onClick={() => {
                                    setNewNoteInfo({ chief_complaint: "", HPI: "", Objective: "", physicalExam_General: "", physicalExam_Heent: "", physicalExam_Lungs: "" });
                                    setDetailsSection(false);
                                }}>
                                    <p className="doctor-notes-button-text">Discard</p>
                                </div>
                                <div className="primary-button"
                                    onClick={() => {
                                        console.log("created")
                                        if (noteInfo === null) {
                                            onCreateNewNote(newNoteInfo);
                                            setNewNoteInfo({ chief_complaint: "", HPI: "", Objective: "", physicalExam_General: "", physicalExam_Heent: "", physicalExam_Lungs: "" });
                                        } else {
                                            onUpdateNote(newNoteInfo);
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
                                    <LabResultBody />
                                </div>
                                {/* <div className="doctors-note-details-part-description-card">
                                    <div className="title-section">
                                        <p className="title-text">No Lab Data available</p>
                                    </div>
                                </div> */}
                            </div>
                            <div className="details-part-section">
                                <p className="parts-titles">Current Tasks:</p>
                                {assignedTaskGroup === undefined
                                    ? (<div className="doctors-note-details-part-description-card">
                                        <div className="title-section" style={{ width: "1005" }}>
                                            <p className="title-text">No Task available</p>
                                        </div>
                                    </div>) :
                                    <div className="doctors-note-details-part-task-detail-card">
                                        <DoctorAssignedTask
                                            isNew={assignedTaskGroup === "" || assignedTaskGroup === undefined}
                                            setVisibleBody={() => { }}
                                            selectedGroup={assignedTaskGroup}
                                            taskTemplateList={[]}
                                            onSubmitTaskGroup={onSubmitTaskGroup}
                                            setSelectedGroup={() => { }}
                                            setIsLoading={() => { }}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="details-part-section">
                                <p className="parts-titles">Assessment & Plan:</p>
                                <input className="part-input-text-container part-input-text-style" placeholder="Click here to start writing" />
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
            }

        </>
    )
}
