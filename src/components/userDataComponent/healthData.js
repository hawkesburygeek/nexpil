import React, { useEffect, useState } from 'react';
import './style.css';
import { useSelector } from 'react-redux';
// import LabResultBody from './labResult/labResultBody';
import { server } from '../../config/server';
import { getHealthGlucoseData_FromCorePhp, getOtherHealthData_FromCorePhp } from '../../api/axiosAPIs';
import axios from '../../api/axios';
// const enumMood = {
//     "1": "very sad",
//     "2": "sad",
//     "3": "neutral",
//     "4": "happy",
//     "5": "very happy",
// }

export const HealthDataComponent = (props) => {
    const { userInfo } = props;
    const [data, setData] = useState(null);
    const [gluecoseData, setGluecoseData] = useState({});
    const [otherHealthData, setOtherHealthData] = useState({});
    const [selectedTest, setSelectedTest] = useState("");
    // eslint-disable-next-line
    useEffect(() => {
        // console.log(userInfo);
        if (userInfo !== undefined || userInfo !== null) {
            let now = new Date();
            let to = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate() < 10 ? "0" + now.getDate() : now.getDate()}`;
            let days = 365;
            let before = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
            let from = `${before.getFullYear()}-${before.getMonth() + 1 < 10 ? "0" + (before.getMonth() + 1) : before.getMonth() + 1}-${before.getDate() < 10 ? "0" + before.getDate() : before.getDate()}`;
            // console.log(from, to);
            const fetchHealthData = () => {
                axios.get(server.serverURL + "v1/healthkit-history?patient_id=" + userInfo.id).then(({ data }) => {
                    console.log("=== healthData === ", data.data)
                    setData(data);
                    setSelectedTest(Object.keys(data.data)[0]);
                }).catch(error => {
                    setData(null);
                    setSelectedTest("");
                })
            };
            fetchHealthData();
            getHealthGlucoseData_FromCorePhp(userInfo.id, from, to, res => {
                // setGluecoseData([...res.history]);
                makeHealthData(res.history);
            });

            to = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate() < 10 ? "0" + now.getDate() : now.getDate()}`;
            days = 14;
            before = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
            from = `${before.getFullYear()}-${before.getMonth() + 1 < 10 ? "0" + (before.getMonth() + 1) : before.getMonth() + 1}-${before.getDate() < 10 ? "0" + before.getDate() : before.getDate()}`;
            getOtherHealthData_FromCorePhp(userInfo.id, from, to, res => {
                setOtherHealthData(res);
                // makeHealthData(res.history);
            });
        }
    }, [userInfo]);// eslint-disable-line react-hooks/exhaustive-deps

    const makeHealthData = (historyList) => {
        let data = {};
        if (Array.isArray(historyList)) {
            for (let i = 0; i < historyList.length; i++) {
                let history = historyList[i];
                // eslint-disable-next-line
                origin = data[history.date];
                if (origin === undefined) {
                    // eslint-disable-next-line
                    origin = {}
                }
                // eslint-disable-next-line
                origin = {
                    ...origin,
                    date: history.date,
                }
                if (history.timing < 3) {
                    // eslint-disable-next-line
                    origin = { ...origin, beforeDeal: history.measurement }
                } else {
                    // eslint-disable-next-line
                    origin = { ...origin, afterDeal: history.measurement }
                }
                data[history.date] = { ...origin };

            }
        }
        setGluecoseData(data);
    }

    return (
        <div className="card-section">
            <h1 className="card-title">Health Data</h1>
            {
                data && selectedTest ?
                    <React.Fragment>
                        {/* <LabResultBody data={data}  title={"health"}/> */}
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <div className="lab-result-category-container">
                                    {
                                        Object.keys(data.data).map((cat, index) => {
                                            return (
                                                <div key={index}
                                                    className="lab-result-category-button"
                                                    onClick={() => setSelectedTest(cat)}
                                                    style={{ background: selectedTest === cat ? "#f1effd" : "#F7F7FA" }}>
                                                    <h4 className="round_head task_template_btn">
                                                        {data.data[cat].title} <span className="round_arrow-add-task">&gt;</span>
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
                                            <p className="title-text">{data.data[selectedTest].title}</p>
                                            <p className="title-date-text">{data.data[selectedTest].last_updated}</p>
                                        </div>
                                        {
                                            data.data[selectedTest].details.map((detail, index) => {
                                                if (index === 0) return (
                                                    <div key={index} className="description-row">
                                                        {
                                                            Object.entries(detail).map((visible, visIndex) => {
                                                                return (
                                                                    <div key={visIndex} style={{ width: "33%" }}>
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
                                                else return (
                                                    <div key={index} className="description-row">
                                                        {
                                                            Object.entries(detail).map((visible, visIndex) => {
                                                                return (
                                                                    <div style={{ width: "33%" }} key={visIndex}>
                                                                        <p className="description-row-info">
                                                                            <span>{visible[1]}</span>
                                                                        </p>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                    :
                    <div className="lab-result-description-section">
                        <div className="lab-result-description-card">
                            <div className="title-section">
                                <p className="title-text">
                                    No Health Data
                                </p>
                            </div>
                        </div>
                    </div>
            }
        </div >
    );
}