import React, { useState, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
// import Autopilot from 'twilio/lib/rest/Autopilot';
import { showAlert } from '../../../my_alert_dlg/showAlertDlg';
import '../../style.css'
import { TASKTYPE } from '../enum_task';

function Questionnaire(props) {
    const initValue = {
        task_name: "",
        task_dueDate: "",
        task_detail: {
            questions: [{
                type: "",
                question: "",
                answers: [""],
            }]
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
            type_id: TASKTYPE.questionnaire,
            task_name: infoDetails.task_name,
            task_dueDate: infoDetails.task_dueDate,
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
            <div className={isFromChat ? "row" : "input-row row"}>
                <div className={isFromChat ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Questionnaire Title"
                        value={infoDetails.task_name === undefined ? "" : infoDetails.task_name}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_name: e.target.value })}
                    />
                </div>
                <div className={isFromChat === true ? "col-12" : "col-6"} style={{ marginTop: 5 }}>
                    <input
                        type="date" style={{ color: infoDetails.task_dueDate === undefined ? "grey" : "black" }}
                        className="add-inputs" placeholder="Due Date"
                        value={infoDetails.task_dueDate === undefined ? "" : infoDetails.task_dueDate}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_dueDate: e.target.value })}
                    />
                </div>
            </div>
            {
                infoDetails.task_detail.questions.map((item, quIndex) => {
                    return (
                        <React.Fragment key={quIndex}>
                            <div className={isFromChat ? "row" : "input-row row"} key={quIndex}>
                                <div className={isFromChat ? "col-12 chat-patient-item-space d-flex" : "col-6 d-flex"}>
                                    <span className="chat-paitient-questionaire-index">{quIndex + 1}.</span>
                                    <TextareaAutosize className="add-inputs py-2" placeholder={`Question #${quIndex + 1}`}
                                        value={item.question}
                                        onChange={(e) => {
                                            const questions = [...infoDetails.task_detail.questions];
                                            questions[quIndex]["question"] = e.target.value;
                                            setInfoDetails({
                                                ...infoDetails,
                                                task_detail: {
                                                    questions: questions
                                                }
                                            });
                                        }}
                                    />
                                </div>
                                <div className={isFromChat ? "col-12 chat-patient-item-space d-flex" : "col-6 d-flex"}>
                                    <button className={item["type"] === "multiple" ? "chat-paitient-questionnaire-choice-active multiple" : "chat-paitient-questionnaire-choice multiple"} onClick={() => {
                                        const questions = [...infoDetails.task_detail.questions];
                                        questions[quIndex]["type"] = "multiple";
                                        questions[quIndex]["answers"] = ["", ""];
                                        console.log(" YYYYYYYYYYYYYYYYYY : ", questions)
                                        setInfoDetails({
                                            ...infoDetails,
                                            task_detail: {
                                                questions: questions,
                                            }
                                        });
                                    }}>
                                        <div className={item.type === "multiple" ? "" : "d-none"}>
                                            <i className="fa fa-check" style={{ marginRight: 10 }} />
                                            Multiple Choice
                                        </div>
                                        <div className={item.type === "multiple" ? "d-none" : ""}>
                                            Multiple Choice
                                            <i className="fa fa-check" style={{ marginLeft: 10 }} />
                                        </div>
                                    </button>
                                    <button className={item["type"] === "short" ? "chat-paitient-questionnaire-choice-active" : "chat-paitient-questionnaire-choice"} onClick={() => {
                                        const questions = [...infoDetails.task_detail.questions];
                                        questions[quIndex]["type"] = "short";
                                        questions[quIndex]["answers"] = [""];
                                        setInfoDetails({
                                            ...infoDetails,
                                            task_detail: {
                                                questions: questions,
                                            }
                                        });
                                    }}>
                                        <div className={item.type === "short" ? "" : "d-none"}>
                                            <i className="fa fa-check" style={{ marginRight: 10 }} />
                                            Short Answer
                                        </div>
                                        <div className={item.type === "short" ? "d-none" : ""}>
                                            Short Answer
                                            <i className="fa fa-check" style={{ marginLeft: 10 }} />
                                        </div>
                                    </button>
                                </div>
                                {
                                    item.type === "multiple" &&
                                    <React.Fragment>
                                        <div className="row d-flex" style={{ width: "90%", marginTop: "10px", marginLeft: "auto", marginRight: "auto" }}>
                                            {
                                                item.answers.map((answer, anIndex) => {
                                                    return (
                                                        <div className="col-6" key={anIndex} style={{ marginBottom: "10px" }}>
                                                            <input className="add-inputs" placeholder={`Choice ${anIndex + 1}`}
                                                                value={answer}
                                                                onChange={(e) => {
                                                                    const answers = [...infoDetails.task_detail.questions[quIndex].answers];
                                                                    answers[anIndex] = e.target.value;
                                                                    const questions = [...infoDetails.task_detail.questions];
                                                                    questions[quIndex]["answers"] = answers;
                                                                    setInfoDetails({
                                                                        ...infoDetails,
                                                                        task_detail: {
                                                                            questions: questions
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </ div>
                                                    );
                                                })
                                            }
                                        </div>
                                        <div className="row" style={{ width: "95%", marginLeft: "auto" }}>
                                            <span style={{ marginLeft: "30px", color: "#4939e3", cursor: "pointer" }} onClick={() => {
                                                const questions = [...infoDetails.task_detail.questions];
                                                questions[quIndex]["type"] = "multiple";
                                                questions[quIndex]["answers"].push("");
                                                setInfoDetails({
                                                    ...infoDetails,
                                                    task_detail: {
                                                        questions: questions,
                                                    }
                                                });
                                            }}>Add Choices</span>
                                        </div>
                                    </React.Fragment>
                                }
                                {
                                    item.type === "short" &&
                                    <React.Fragment>
                                        {
                                            item.answers.map((answer, anIndex) => {
                                                return (
                                                    <div className="row" key={anIndex} style={{ width: "85%", marginLeft: "auto", marginRight: "auto", marginTop: "10px" }}>
                                                        <TextareaAutosize className="add-inputs py-2" placeholder="Answer Input Field"
                                                            value={answer}
                                                            onChange={(e) => {
                                                                const answers = [...infoDetails.task_detail.questions[quIndex].answers];
                                                                answers[anIndex] = e.target.value;
                                                                const questions = [...infoDetails.task_detail.questions];
                                                                questions[quIndex]["answers"] = answers;
                                                                setInfoDetails({
                                                                    ...infoDetails,
                                                                    task_detail: {
                                                                        questions: questions
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </ div>
                                                );
                                            })
                                        }
                                    </React.Fragment>
                                }
                            </div>
                        </React.Fragment>
                    );
                })
            }
            <div>
                <span className="chat-paitient-questionaire-index">{infoDetails.task_detail.questions.length + 1}.</span>
                <span style={{ marginLeft: "30px", color: "#4939e3", cursor: "pointer" }} onClick={() => {
                    const questions = [...infoDetails.task_detail.questions];
                    questions.push({
                        type: "",
                        question: "",
                        answers: [""],
                    });
                    setInfoDetails({
                        ...infoDetails,
                        task_detail: {
                            questions: questions,
                        }
                    });
                }}>Add Question</span>
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
        </div >
    )
}

export default Questionnaire