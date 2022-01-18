import React from 'react'
import { useState } from 'react';

// const data = {
//     blood_test: {
//         title: "Blood Test",
//         date: "10-12-2020",
//         details: [
//             { title: "Cholesterol", amount: 229, unit: "mg/dl" },
//             { title: "HDL", amount: 45, unit: "mg/dl" },
//             { title: "LDL", amount: 165, unit: "mg/dl" },
//             { title: "Triglycerdes", amount: 93, unit: "mg/dl" },
//             { title: "Hemoglobin Alc", amount: 8.5, unit: "%" },
//             { title: "PT - INR", amount: 2.1, unit: "" },
//         ]
//     },
//     mri_test: {
//         title: "MRI Test",
//         date: "05-12-2020",
//         details: [
//             { title: "Cholesterol", amount: 150, unit: "mg/dl" },
//             { title: "HDL", amount: 12, unit: "mg/dl" },
//             { title: "LDL", amount: 200, unit: "mg/dl" },
//             { title: "Triglycerdes", amount: 57, unit: "mg/dl" },
//         ]
//     },
//     x_ray_test: {
//         title: "X- Rays Test",
//         date: "10-06-2020",
//         details: [
//             { title: "Cholesterol", amount: 229, unit: "mg/dl" },
//             { title: "HDL", amount: 45, unit: "mg/dl" },
//             { title: "LDL", amount: 165, unit: "mg/dl" },
//             { title: "Triglycerdes", amount: 93, unit: "mg/dl" },
//             { title: "Hemoglobin Alc", amount: 8.5, unit: "%" },
//             { title: "PT - INR", amount: 2.1, unit: "" },
//             { title: "Hemoglobin Alc", amount: 8.5, unit: "%" },
//             { title: "Hemoglobin Alc", amount: 8.5, unit: "%" },
//         ]
//     },
// }

// const labCatList = [
//     "blood_test", "mri_test", "x_ray_test"
// ]
function LabResultBody(props) {
    const [selectedTest, setSelectedTest] = useState("blood_test");
    console.log("LabResultBody Props ===> ", props);
    if (!props.data || !props.data.data || props.data.data.length === 0) {
        if (props.title === "lab") {
            return (
                <div className="lab-result-description-section">
                    <div className="lab-result-description-card">
                        <div className="title-section">
                            <p className="title-text">
                                No Lab Results
                            </p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="lab-result-description-section">
                    <div className="lab-result-description-card">
                        <div className="title-section">
                            <p className="title-text">
                                No Health Data
                            </p>
                        </div>
                    </div>
                </div>
            )
        }
    }
    else {
        const { data } = props.data;
        console.log(Object.keys(data))
        return (
            <div>
                <div className="row">
                    <div className="col-12 col-sm-6">
                        <div className="lab-result-category-container">
                            {
                                Object.keys(data).map((cat, index) => {
                                    return (<div
                                        key={`lab_result_${index}`}
                                        className="lab-result-category-button"
                                        onClick={() => setSelectedTest(cat)}
                                        style={{ background: selectedTest === cat ? "#f1effd" : "#F7F7FA" }}
                                    >
                                        <h4 className="round_head task_template_btn">
                                            {data[cat].title} <span className="round_arrow-add-task">&gt;</span>
                                        </h4>
                                    </div>)
                                })
                            }
                        </div>
                    </div>
                    <div className="col-12 col-sm-6">
                        <div className="lab-result-description-section">
                            <div className="lab-result-description-card">
                                <div className="title-section">
                                    <p className="title-text">{data[selectedTest].title}</p>
                                    <p className="title-date-text">{data[selectedTest].date}</p>
                                </div>
                                {
                                    data[selectedTest].details.map((detail, index) => {
                                        return (<div key={`${data[selectedTest].title}_${index}`}
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
                </div>
            </div>
        )
    }
}

export default LabResultBody
