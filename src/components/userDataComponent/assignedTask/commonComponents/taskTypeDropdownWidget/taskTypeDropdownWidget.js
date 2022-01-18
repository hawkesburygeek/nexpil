import React, { useState } from 'react'
import '../../../style.css'
import { TASKNAME, TASKTYPE } from '../../enum_task';

function TaskTypeDropdownWidget(props) {
    const { selTaskType, setSelTaskType, isFromChat } = props;
    const [isVisible, setIsVisible] = useState(false);
    const taskTypeList = [
        { itemKey: TASKTYPE.list, title: TASKNAME.list },
        { itemKey: TASKTYPE.prescribe_medication, title: TASKNAME.prescribe_medication },
        { itemKey: TASKTYPE.treatment_plan, title: TASKNAME.treatment_plan },
        { itemKey: TASKTYPE.appintment_scheduling, title: TASKNAME.appintment_scheduling },
        { itemKey: TASKTYPE.refer_to_doctor, title: TASKNAME.refer_to_doctor },
        { itemKey: TASKTYPE.questionnaire, title: TASKNAME.questionnaire },
    ];

    const childUIList = taskTypeList.map((listInfo, index) => {
        return (
            <li key={index}
                className="dropdown-item type_btn"
                onClick={() => {
                    setIsVisible(false);
                    setSelTaskType(listInfo.itemKey)
                }}>
                {listInfo.title}
            </li>
        );
    });
    console.log("taskTypeList === ", taskTypeList)
    console.log("taskTypeList props === ", props)
    console.log("tyskType selected ==== ", taskTypeList.filter(x => parseInt(x.itemKey) === parseInt(selTaskType)))
    const title = selTaskType === TASKTYPE.none ? "Task Type" : taskTypeList.filter(x => parseInt(x.itemKey) === parseInt(selTaskType))[0].title;
    return (
        <div className={"task_btn-group"}
            style={isFromChat ? { width: "95%", textAlign: 'left' } : { float: 'left', width: "35%" }}>
            <div className="col2-roundblocktask"
                onClick={() => setIsVisible(true)}
                data-toggle="dropdown"
                aria-expanded="true">
                <h4 className="round_head"><span className="task_type_btn">{title}</span>
                    <span className="round_arrow-add-task">&gt;</span>
                </h4>
            </div>
            {isVisible && <ul className="dropdown-menu shildra_task_ul_dropdown" id="task-type" x-placement="bottom-start">
                {childUIList}
            </ul>}
        </div>
    )
}

export default TaskTypeDropdownWidget
