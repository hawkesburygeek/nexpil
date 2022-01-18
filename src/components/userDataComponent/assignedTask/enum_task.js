export const TASKTYPE = {
    none: 0,
    list: 1,
    prescribe_medication: 2,
    treatment_plan: 3,
    appintment_scheduling: 4,
    refer_to_doctor: 5,
    questionnaire: 6,
};

export const TASKNAME={
    none: "All Task",
    list: "List" ,
    prescribe_medication: "Prescribe Medication",
    treatment_plan: "Treatment Plan",
    appintment_scheduling: "Appointment Scheduling",
    refer_to_doctor: "Refer to Doctor",
    questionnaire: "Questionnaire",
}

export const TASKADDINGSTATUS = {
    new_task: 0,
    update_old_task: 1,
    update_temp_task: 2
}

export const ALL_TASK_NAME = "All Task";


export function getEnumKeyByValue(Enum, val) {
    return Object.keys(Enum).find(
        key => Enum[key] === val
    )
}