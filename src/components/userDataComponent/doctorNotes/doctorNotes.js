import React, { useEffect, useState } from 'react';
import '../style.css';
import { DoctorNotesDetails } from './doctorNotesComponents';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { server } from '../../../config/server';

import { showConfirm } from "../../my_confirm_dlg/showConfirmDlg";
import { showAlert } from "../../my_alert_dlg/showAlertDlg";
// import LoadingOverlay from 'react-loading-overlay';


export const DoctorNotes = (props) => {
    const { homeUserName, setCreatedGroupId } = props;
    const { createdGroupId } = props;
    const selectedPatient = useSelector(state => state.patientSelect);
    const [doctorNoteList, setDoctorNoteList] = useState([]);
    const [setIsLoading] = useState(false);
    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token,
            'Content-Type': 'application/json',
        }
    }
    // console.log("doctor note", createdGroupId);
    useEffect(() => {
        if (selectedPatient && selectedPatient.id) {
            getNoteList(selectedPatient.id);
        }
    }, [selectedPatient]);// eslint-disable-line react-hooks/exhaustive-deps

    const getNoteList = (userId) => {
        axios.get(server.serverURL + "v1/doctor-note", { ...config })
            .then((res) => {
                // console.log(res.data.data);
                var tmpNoteList = res.data.data.results;
                if (tmpNoteList.length > 0) {
                    tmpNoteList = tmpNoteList.filter(x => x.patient_id === userId);
                    // console.log(tmpNoteList);
                    tmpNoteList.sort((a, b) => (a.created_at > b.created_at) ? -1 : ((b.created_at > a.created_at) ? 1 : 0));

                    setDoctorNoteList([...tmpNoteList]);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onCreateNewNote = async (noteInfo) => {
        var _noteInfo = { ...noteInfo, patient_id: selectedPatient.id, group_id: 0 };

        console.log("create note param : ", _noteInfo);
        if (await showConfirm({
            content: 'Are you sure to add new Note?'
        })) {
            // console.log(requestData)
            console.log("loadign start");
            setIsLoading(true);
            axios.post(server.serverURL + "v1/doctor-note", _noteInfo, { ...config })
                .then((res) => {
                    // console.log(res);
                    showAlert({ content: "The new note has been added." });
                    getNoteList(selectedPatient.id);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                })
        } else {
            console.log('no');
        }

    }

    const onDiscardNote = async (noteInfo) => {
        var _noteInfo = { ...noteInfo, patient_id: selectedPatient.id };
        if (await showConfirm({
            content: 'Are you sure to Discard this note?'
        })) {
            setIsLoading(true);
            axios.delete(server.serverURL + "v1/doctor-note/" + _noteInfo.doctor_note_id, { ...config })
                .then((res) => {
                    getNoteList(selectedPatient.id);
                    setIsLoading(false);
                    showAlert({ content: "The note has been discarded." });
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                })
        }
    }

    const onSignNote = async (noteId) => {
        // console.log(noteId);
        var _noteId = noteId;
        if (await showConfirm({
            content: 'Are you sure to sign this note?'
        })) {
            setIsLoading(true);
            axios.put(server.serverURL + "v1/doctor-note/" + _noteId, { "is_sign": 1 }, { ...config })
                .then((res) => {
                    getNoteList(selectedPatient.id);
                    setIsLoading(false);
                    showAlert({ content: "The note has been signed." });
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                })
        }
    }

    const onUpdateNote = async (noteInfo) => {
        var _noteInfo = { ...noteInfo, patient_id: selectedPatient.id };
        // console.log("updated", noteInfo);
        if (await showConfirm({
            content: 'Are you sure to update this note?'
        })) {
            setIsLoading(true);
            axios.put(server.serverURL + "v1/doctor-note/" + _noteInfo.doctor_note_id, _noteInfo, { ...config })
                .then((res) => {
                    showAlert({ content: "The note has been updated." });
                    getNoteList(selectedPatient.id);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                })
        }
    }

    // console.log("note list", doctorNoteList);
    return (
        <div className="card-section">
            <h1 className="card-title">Doctor’s Notes</h1>
            <DoctorNotesDetails
                noteInfo={null} key={`note_info_key_create_new`}
                onCreateNewNote={onCreateNewNote}
                assignedTaskGroupId={createdGroupId}
                homeUserName={homeUserName}
                setCreatedGroupId={setCreatedGroupId}
            />
            {doctorNoteList.map((item, i) =>
                <DoctorNotesDetails
                    noteInfo={item}
                    key={`note_info_key_${i}`}
                    onSignNote={onSignNote}
                    onDiscardNote={onDiscardNote}
                    onUpdateNote={onUpdateNote}
                    homeUserName={homeUserName}
                    setCreatedGroupId={setCreatedGroupId}
                />
            )}

        </div>
    )
}