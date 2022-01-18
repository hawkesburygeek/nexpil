import React, { useEffect } from 'react';
import './style.css';
import { SideBar } from '../../components';
import { useHistory } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';


export const TelehealthPage = (props) => {
    const history = useHistory();
    useEffect(() => {
        // checkUserToken();
    }, []);
    const checkUserToken = () => {
        var token = localStorage.getItem("token");
        if (!token) {
            history.push("/login");
        } else {
            history.push("/calendar");
        }
    }
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    return (
        <div className="intro-page-container">
            <SideBar select={"telehealth"}></SideBar>
            <div className="d-flex justify-content-around">
                <div className="tele-main flex-column justify-content-center">
                    <div className="d-flex flex-column">
                        <div className="tele-icon">
                            <img src="assets/images/tele-icon.png" width={230}/>
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-around">                    
                        <div className="d-flex justify-content-between fw-600">
                            <div>
                                <div>Call Duration</div>
                                <div>07:08</div>
                            </div>
                            <div>
                                <div>Dwayne Johnson</div>
                                <div>5/26/1988 - Male</div>
                            </div>
                        </div>                        
                        <div><img src="assets/images/tele-user.png" className="large-img" /></div>
                        <div className="avatar-group">
                            <div className="d-flex justify-content-around">
                                <div className="align-self-end pl-3"><img src="assets/images/phone1.png" width="60"/></div>
                                <div className="align-self-end pl-3"><img src="assets/images/phone2.png" width="40"/></div>
                                <div className="align-self-end pl-3"><img src="assets/images/avatar3.png" width="90"/></div>
                                <div className="align-self-end pl-3"><img src="assets/images/avatar2.png" width="90"/></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="health-info d-flex flex-column justify-content-center">
                    <div className="checked-header">
                        <div className="d-flex justify-content-around">
                            <div className="checked-title">Medication Therapy<br/> Management Tasks</div>
                            <div className="checked-info">6 out of 6<br/> completed</div>
                        </div>
                    </div>
                    <div>
                        <div className="complete-item d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <CheckCircleIcon color="success" />
                                <List dense={dense}>
                                    <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                        <AddIcon />
                                        </IconButton>
                                    }
                                    >
                                    <ListItemText
                                        primary="Allergies"
                                        secondary={secondary ? 'Secondary text' : null}
                                    />
                                    </ListItem>
                                </List>                            
                            </div>
                        </div>
                        <div className="complete-item d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <CheckCircleIcon color="success" />
                                <List dense={dense}>
                                    <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                        <AddIcon />
                                        </IconButton>
                                    }
                                    >
                                    <ListItemText
                                        primary="Medication History"
                                        secondary={secondary ? 'Secondary text' : null}
                                    />
                                    </ListItem>
                                </List>                            
                            </div>
                        </div>
                        <div className="complete-item d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <CheckCircleIcon color="success" />
                                <List dense={dense}>
                                    <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                        <AddIcon />
                                        </IconButton>
                                    }
                                    >
                                    <ListItemText
                                        primary="Survey Answers"
                                        secondary={secondary ? 'Secondary text' : null}
                                    />
                                    </ListItem>
                                </List>                            
                            </div>
                        </div>
                        <div className="complete-item d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <CheckCircleIcon color="success" />
                                <List dense={dense}>
                                    <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                        <AddIcon />
                                        </IconButton>
                                    }
                                    >
                                    <ListItemText
                                        primary="Past Visit Notes"
                                        secondary={secondary ? 'Secondary text' : null}
                                    />
                                    </ListItem>
                                </List>                            
                            </div>
                        </div>
                        <div className="complete-item d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <CheckCircleIcon color="success" />
                                <List dense={dense}>
                                    <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                        <AddIcon />
                                        </IconButton>
                                    }
                                    >
                                    <ListItemText
                                        primary="Gaps In Care"
                                        secondary={secondary ? 'Secondary text' : null}
                                    />
                                    </ListItem>
                                </List>                            
                            </div>
                        </div>
                        <div className="complete-item d-flex flex-column">
                            <div className="d-flex align-items-center">
                                <CheckCircleIcon color="success" />
                                <List dense={dense}>
                                    <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                        <AddIcon />
                                        </IconButton>
                                    }
                                    >
                                    <ListItemText
                                        primary="After Visit Summary"
                                        secondary={secondary ? 'Secondary text' : null}
                                    />
                                    </ListItem>
                                </List>                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
