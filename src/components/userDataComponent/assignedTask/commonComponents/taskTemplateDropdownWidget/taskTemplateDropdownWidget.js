import React, { useState } from 'react'
import '../../../style.css'
import { ALL_TASK_NAME } from '../../enum_task';

function TaskTemplateDropdownWidget(props) {
    const { selTaskTemplate, setSelTaskTemplate, taskTemplateList, isFromChat } = props;
    const [isVisible, setIsVisible] = useState(false);

    const selectedTask = selTaskTemplate !== "" && selTaskTemplate !== ALL_TASK_NAME ? "" : taskTemplateList.filter(x => x.id === selTaskTemplate.id);
    const title = selTaskTemplate === "" ? "Task Template" : selTaskTemplate === ALL_TASK_NAME ? ALL_TASK_NAME : selectedTask.length > 0 ? selectedTask[0].title : "Task Template";
    return (
        <div className={"task_btn-group"}
            style={isFromChat ? { width: "95%", textAlign: 'left' } : { float: 'right', width: "35%" }}>
            <div className="col2-roundblocktask"
                onClick={() => {
                    setIsVisible(true);
                }}
                data-toggle="dropdown"
                aria-expanded="true">
                <h4 className="round_head"><span className="task_type_btn">{title}</span><span className="round_arrow-add-task">&gt;</span></h4>
            </div>

            {isVisible && <ul className="dropdown-menu shildra_task_ul_dropdown" id="task-type-template" x-placement="bottom-start">
                {
                    taskTemplateList.map((taskTemplate, index) =>
                        <li key={index}
                            className="dropdown-item type_btn"
                            onClick={() => {
                                setIsVisible(false);
                                setSelTaskTemplate(taskTemplate);
                            }}>
                            {taskTemplate.title}
                        </li>
                    )
                }
                <li className="dropdown-item type_btn"
                    onClick={() => {
                        setIsVisible(false);
                        setSelTaskTemplate(ALL_TASK_NAME);
                    }}>
                    {/* {ALL_TASK_NAME} */}
                </li>
            </ul>}
        </div>
    )
}

export default TaskTemplateDropdownWidget
