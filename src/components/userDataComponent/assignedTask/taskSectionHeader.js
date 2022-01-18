import clsx from 'clsx';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import '../style.css'

function TaskSectionHeader(props) {
    const { onSelectGroup, setVisibleBody, onDeleteGroup, isFromChat, isFromNote, isAboveItem } = props;
    const dispatch = useDispatch();
    const userTaskGroupList = useSelector(state => state.userTaskGroupList);

    const onHandleClick = (item) => {
        onSelectGroup(item.id);
        setVisibleBody(true);
    }
    const onClickAddNewTask = () => {
        dispatch({ type: "SELECT_PATIENT_TASK_GROUP", payload: null });
        setVisibleBody(true);
    }
    const onClickDelete = (item) => onDeleteGroup(item.id);

    const userTaskGroupUIList = userTaskGroupList.map((item, index) => {
        if (isFromChat) return (
            <div key={index} style={{ textAlign: 'center' }}>
                <div className={item.is_template === "0" ? "patient-page-existing-task-style" : "patient-page-existing-task-title-style-complete"}
                    style={{ width: "95%" }}>
                    <div style={{ width: "100%" }}>
                        <span className="float-left" style={item.is_template === "0" ? { color: 'black' } : { color: 'white' }}
                            onClick={() => onHandleClick(item)}>
                            {item.group_name}
                        </span>
                        {/* <span className="float-right" style={item.is_template === "0" ? { color: 'darkgray' } : { color: 'white' }}>
                                    {item.is_template}
                                </span> */}
                        {/* <span className="patient-page-delete-group-button float-right"
                                    style={{ marginRight: '5%' }}
                                    onClick={() => onClickDelete(item)}>
                                    &times;
                                </span> */}
                    </div>
                </div>
            </div>

        );
        else return (
            <div key={index} className={clsx(isFromNote ? "patient-page-existing-task-style-from-note" : "patient-page-existing-task-style")}>
                <div className="patient-page-existing-task-title-style" >
                    <span onClick={() => onHandleClick(item)}>{item.group_name}</span>
                    <span className="patient-page-delete-group-button" onClick={() => onClickDelete(item)}>&times;</span>
                </div>
            </div>
        );
    });

    if (isFromChat) return (
        <div>
            {userTaskGroupUIList}
            <div className="patient-page-add-task-button-style"
                style={{ width: "95%", textAlign: 'center' }}
                onClick={onClickAddNewTask}>
                Add New Task
            </div>
        </div>
    );
    else if (isFromNote) {
        if (isAboveItem) return (
            <div className="patient-page-existing-task-container-style">
                {userTaskGroupUIList}
            </div>
        );
        else return (
            <div className="patient-page-existing-task-container-style">
                <div className="patient-page-add-task-button-style"
                    onClick={onClickAddNewTask}>
                    Add New Task
                </div>
            </div>
        );
    } else return (
        <div className="patient-page-existing-task-container-style">
            <div className="patient-page-add-task-button-style"
                onClick={onClickAddNewTask}>
                Add New Task
            </div>
            {userTaskGroupUIList}
            <div className="assigned-tasks-container row"></div>
        </div>
    );
}

export default TaskSectionHeader
