import React from 'react';
import './style.css';
import { SideBar } from '../../components';
import { useSelector } from 'react-redux';
import { ChatWindow } from '../../components/chatWindow';

export const UserDetailPage = () => {
    const user = useSelector(state => state.patientSelect);
    const recordInfo = (user.lapResult ? user.lapResult : {});
    return (
        <div className="details-container">
            <SideBar select={"chat"} />
            <div className="detail-main-section">
                <div className="detail-row-grid-1">
                    <div className="video-call-window">
                        <div className="video-call-main-section"></div>
                    </div>
                    <div className="detail-every-section">
                        <h1 className="detail-title">Assigned Tasks:</h1>
                        <div className="assigned-tasks-container">
                            <div className="add-tasks-button">
                                <p className="add-tasks-button-text">Add New Task</p>
                            </div>
                            <div className="assigned-tasks-cards">
                                <p className="assigned-tasks-texts-title">Check Blood Sugar</p>
                                <p className="assigned-tasks-texts-description">3 / 7 Days Complete</p>
                            </div>
                            <div className="assigned-tasks-cards">
                                <p className="assigned-tasks-texts-title">Schedule a Blood Test</p>
                                <p className="assigned-tasks-texts-description">Complete</p>
                            </div>
                        </div>
                        <div className="assigned-tasks-container">
                            <div className="assigned-tasks-cards">
                                <p className="assigned-tasks-texts-title">Make a Follow-Up Appointment</p>
                                <p className="assigned-tasks-texts-description">Incomplete</p>
                            </div>
                            <div className="assigned-tasks-cards">
                                <p className="assigned-tasks-texts-title">Task #5</p>
                                <p className="assigned-tasks-texts-description"></p>
                            </div>
                            <div className="assigned-tasks-cards">
                                <p className="assigned-tasks-texts-title">Task #6</p>
                                <p className="assigned-tasks-texts-description"></p>
                            </div>
                        </div>
                    </div>
                    <div className="detail-every-section">
                        <h1 className="detail-title">Lab Work</h1>
                        <div className="detail-lab-work-description-section">
                            <div className="description-card">
                                <div className="title-section">
                                    <p className="title-text">Blood Test</p>
                                    <p className="title-date-text">7-8-2020</p>
                                </div>
                                
                                {recordInfo.bloodTest && recordInfo.bloodTest.map((item, i) =>
                                    <div key={i} className="description-row">
                                        <p className="description-row-title">{item.title}</p>
                                        <p className="description-row-info"><span>{item.info.amount}</span>&nbsp;{item.info.unit}</p>
                                    </div>
                                )}

                            </div>
                            <div className="record-data-container">
                                <div className="description-card-rigth-side">
                                    <div className="title-section">
                                        <p className="title-text">X-Rays</p>
                                    </div>
                                    
                                    {recordInfo.xRays && recordInfo.xRays.map((item, i) =>
                                        <div key={i} className="description-row">
                                            <p className="description-row-title">{item.title}</p>
                                            <p className="description-row-info"><span>{item.info}</span></p>
                                        </div>
                                    )}

                                </div>
                                <div className="description-card-rigth-side">
                                    <div className="title-section">
                                        <p className="title-text">MRI</p>
                                    </div>
                                    {recordInfo.mri && recordInfo.mri.map((item, i) =>
                                        <div key={i} className="description-row">
                                            <p className="description-row-title">{item.title}</p>
                                            <p className="description-row-info"><span>{item.info}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detail-row-grid-2">
                    <div className="detail-grid-2-every-section">
                        <h1 className="detail-title">Doctor’s Notes</h1>
                        <div className="notes-container-card">
                            <h1 className="notes-title">Chief Complaint:</h1>
                            <p className="notes-description">Lorem ipsum dolor sit amet, has an nobis viderer</p>
                            <h1 className="notes-title">HPI:</h1>
                            <p className="notes-description">Lorem ipsum dolor sit amet, has an nobis viderer, has et exerci omnesque. Quo probo albucius at, at docendi molestie vis, id tempor mucius propriae his. Omnium sententiae id vim, eu nonumes quaestio sed, diceret consetetur incorrupte usu at.</p>
                            <h1 className="notes-title">Objective:</h1>
                            <p className="notes-description">Lorem ipsum dolor sit amet, has an nobis viderer, has et exerci omnesque. Quo probo albucius at,</p>
                        </div>
                    </div>
                    <div className="detail-every-section-personal-info">
                        <h1 className="detail-title">Patient Profile</h1>
                        <div className="user-details-personal-info-card">
                            <div className="personal-info-section">
                                    <p className="personal-info-description">{user.age}</p>
                                    <p className="personal-info-title">Age</p>
                            </div>
                            <div className="personal-info-section">
                                    <p className="personal-info-description">{user.birthday}</p>
                                    <p className="personal-info-title">D.O.B</p>
                            </div>
                            <div className="personal-info-section">
                                    <p className="personal-info-description">{user.allergies}</p>
                                    <p className="personal-info-title">Allergies</p>
                            </div>
                        </div>
                    </div>
                    <div className="details-page-chat-window">
                        <ChatWindow page={"details"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

