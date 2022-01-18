import React, { useState, useEffect } from 'react';
import './style.css';
import { BsCalendar} from "react-icons/bs";
import { sharedColors } from '../../theme/sharedColor';
import { routers } from '../../config/router';
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';

import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import { server } from "../../config/server";
import Badge from '@mui/material/Badge';
import { borderRadius } from '@mui/system';
let navIcons = [];
let token = localStorage.getItem("token");

export const SideBar = ({ select }) => {
    const history = useHistory();

    // Style for special text
    const specialColorFont = {
        color: sharedColors.primaryFontColor,
    }
    const [navMenu, setNavMenu] = useState([]);
    const [selectedTab, setSelectedTab] = useState();
    const [userName, setUserName] = useState();
    const [click, setClick] = useState();
    const [notifications, setNotifications] = React.useState([]);
    const [invisible, setInvisible] = React.useState(false);
    const [count, setCount] = React.useState(1);
    const [status, setChangeStatus] = React.useState(0);
    const [countNotification, setCountNotification] = React.useState(0);

    let username;
    // Set selected tab icon highlihgt when selectedTab changes
    useEffect(() => {
        console.log(localStorage)
        setSelectedTab(select);
        setUserName(localStorage.getItem('userName'));
        // get_notifyInfo(localStorage.getItem('id'))
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const foo = params.get('info');       
        
        console.log(foo);
        if (foo == "videocall" || foo == "video") {
            // alert("tele");
        navIcons = [
            // {
            //     route: routers.HOMEPAGE,
            //     element: <BsPerson size="33px" color={sharedColors.primaryFontColor} />,
            //     id: 'home',
            //     name: 'Patients',
            // }, 
            {
                route: routers.CALENDAR_PAGE,
                element: <BsCalendar size="33px" color={sharedColors.primaryFontColor} />,
                id: 'calendar',
                name: 'Schedule',
            },
            // {
            //     route: routers.CHATPAGE,
            //     element: <BsChatSquareDots size="33px" color={sharedColors.primaryFontColor} />,
            //     id: 'chat',
            //     name: 'Chat',
            // },
            /*{
                route: routers.NOTIFICATION,
                element: <BsBell size="33px" color={sharedColors.primaryFontColor} />,
                id: 'notify',
                name: 'Notifications',
            },*/ 
            // {
            //     route: routers.SETTINGS,
            //     element: <BsGear size="33px" color={sharedColors.primaryFontColor} />,
            //     id: 'setting',
            //     name: 'Settings',
            // }, 
            {
                route: routers.TELEHEALTHPAGE,
                element: <BsCalendar size="33px" color={sharedColors.primaryFontColor} />,
                id: 'chat',
                name: 'Telehealth',
            },
            {
                route: "/",
                // element: <BiLogOut size="33px" color={sharedColors.primaryFontColor} />,
                id: 'logout',
                name: 'Logout',
            }
        ]
        }
        else if(foo == null && select != "profile") {
            // alert("non-tele");
            navIcons = [
                // {
                //     route: routers.HOMEPAGE,
                //     element: <BsPerson size="33px" color={sharedColors.primaryFontColor} />,
                //     id: 'home',
                //     name: 'Patients',
                // }, 
                {
                    route: routers.CALENDAR_PAGE,
                    element: <BsCalendar size="33px" color={sharedColors.primaryFontColor} />,
                    id: 'calendar',
                    name: 'Schedule',
                },
                // {
                //     route: routers.CHATPAGE,
                //     element: <BsChatSquareDots size="33px" color={sharedColors.primaryFontColor} />,
                //     id: 'chat',
                //     name: 'Chat',
                // },
                /*{
                    route: routers.NOTIFICATION,
                    element: <BsBell size="33px" color={sharedColors.primaryFontColor} />,
                    id: 'notify',
                    name: 'Notifications',
                },*/ 
                // {
                //     route: routers.SETTINGS,
                //     element: <BsGear size="33px" color={sharedColors.primaryFontColor} />,
                //     id: 'setting',
                //     name: 'Settings',
                // }, 
                // {
                //     route: routers.TELEHEALTHPAGE,
                //     element: <BsCalendar size="33px" color={sharedColors.primaryFontColor} />,
                //     id: 'chat',
                //     name: 'Chat',
                // },
                {
                    route: "/",
                    // element: <BiLogOut size="33px" color={sharedColors.primaryFontColor} />,
                    id: 'logout',
                    name: 'Logout',
                }
            ]
        }
        else {
            navIcons = [
                // {
                //     route: routers.HOMEPAGE,
                //     element: <BsPerson size="33px" color={sharedColors.primaryFontColor} />,
                //     id: 'home',
                //     name: 'Patients',
                // }, 
                {
                    route: routers.CALENDAR_PAGE,
                    element: <BsCalendar size="33px" color={sharedColors.primaryFontColor} />,
                    id: 'calendar',
                    name: 'Schedule',
                },
                // {
                //     route: routers.CHATPAGE,
                //     element: <BsChatSquareDots size="33px" color={sharedColors.primaryFontColor} />,
                //     id: 'chat',
                //     name: 'Chat',
                // },
                /*{
                    route: routers.NOTIFICATION,
                    element: <BsBell size="33px" color={sharedColors.primaryFontColor} />,
                    id: 'notify',
                    name: 'Notifications',
                },*/ 
                // {
                //     route: routers.SETTINGS,
                //     element: <BsGear size="33px" color={sharedColors.primaryFontColor} />,
                //     id: 'setting',
                //     name: 'Settings',
                // }, 
                {
                    route: routers.TELEHEALTHPAGE,
                    element: <BsCalendar size="33px" color={sharedColors.primaryFontColor} />,
                    id: 'profile',
                    name: 'Profile',
                },
                {
                    route: "/",
                    // element: <BiLogOut size="33px" color={sharedColors.primaryFontColor} />,
                    id: 'logout',
                    name: 'Logout',
                }
            ]
        }
        setNavMenu(navIcons);      
        setClick(2);
        getNotification();
    }, [select, status]);
    console.log(navMenu);
    
    const logOutHandle = () => {
        localStorage.clear();
        history.push("login");
    }
    // -----------------------popover--------------------------
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [anchorE2, setAnchorE2] = React.useState(null);

    const handleClick2 = (event) => {
        setAnchorE2(event.currentTarget);
    };

    const handleClose2 = () => {
        setAnchorE2(null);
    };
    const getNotification = () => {
        axios.get(server.serverURL + "v1/notifications", {
            headers: {
                Authorization: "Bearer " + token,
            },
          })
          .then(function (response) {
                setCountNotification(response.data.data.length)
                setNotifications(response.data.data)
          });
    }
    const handleBadgeVisibility = () => {
        setInvisible(!invisible);
    };
    const checkedNotification = (id) => {
        axios.put(server.serverURL + "v1/notifications/" +  id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
          })
          .then(function (response) {
              alert("checked");
                setChangeStatus(Math.random());
          });
    }
    const open = Boolean(anchorEl);
    const id1 = open ? 'simple-popover' : undefined;

    const open2 = Boolean(anchorE2);
    const id2 = open2 ? 'simple-popover' : undefined;
    
    return (
        <div className="side-bar d-flex">
            <Link className="home-link" to={{
                pathname: routers.HOMEPAGE,
                state: { mode: "intro" }
            }}>
                <h1 className="side-bar-full-title">n<span style={specialColorFont}>.</span></h1>
                <h1 className="side-bar-reduced-title">n<span style={specialColorFont}>.</span></h1>                
            </Link>
            <div className="navigation-icons-container justify-content-between">
                <div className="d-flex">
                {navMenu.map((item, i) => {
                    if (selectedTab !== "calendar") {
                        if (item.id === "logout") {
                            return (                        
                                <div key={i} className="navigation-icons-row">
                                    <div id={item.id} className={item.id !== selectedTab ? "navigation-icon-none-selected" : "navigation-icon-selected"}>
                                        
                                        {item.element}
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <Link key={i} className="navigation-icons-row" to={item.route}>
                                    <div id={item.id} className={item.id !== selectedTab ? "navigation-icon-none-selected" : "navigation-icon-selected"}>
                                        {/* {item.element}  */}
                                        <span className="sidebar-name">{item.name}</span>
                                    </div>
                                </Link>
                            );
                        }
                    } else {
                        if (item.id === "logout") {
                            return (                        
                                <div key={i} className="navigation-icons-row">
                                    <div id={item.id} className={item.id !== selectedTab ? "navigation-icon-none-selected" : "navigation-icon-selected"}>
                                        
                                        {item.element}
                                    </div>
                                </div>
                            );
                        } else {                            
                            {/* if(item.id === "calendar") { */}
                                return (
                                    <Link key={i} className="navigation-icons-row" to={item.route}>
                                        <div id={item.id} className={item.id !== selectedTab ? "navigation-icon-none-selected" : "navigation-icon-selected"}>
                                            {/* {item.element}  */}
                                            <span className="sidebar-name">{item.name}</span>
                                        </div>
                                    </Link>
                                );
                            {/* } */}
                        }
                    }
                }
                )}
                
                </div>
                <div className="d-flex align-items-center pr-5">
                    <span className="alarm-content" aria-describedby={id1} variant="contained" onClick={handleClick}>
                        <Badge color="secondary" badgeContent={countNotification} overlap="circular">
                            <img src="/assets/images/ring.png" className="icon-size"/>
                        </Badge>
                    </span>
                    
                    <span className="avatar-border" aria-describedby={id2} variant="contained" onClick={handleClick2}>
                        <div className="avatar-content d-flex justify-content-around">
                            <div className="avatar-title">
                                <div>{userName}</div>
                                <span className="on-off" style={{fontSize:15}}>Online</span>
                            </div>
                            <div className="image-position"><img src={localStorage.getItem('userImage')} className="img-circle avatar-size"/></div>
                            <div className="badge badge-pill badge-success on-off-icon"></div>
                        </div>                                        
                    </span>
                </div>
            </div>
            <Popover
                id={id1}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical:'bottom',
                    horizontal: 'center',
                }}
                style={{ borderRadius: '12px 12px 0 12px!important', top:"0px!important" }}
                className="notification popover_class"
            >
                <div className="notification-header">
                    <h3 className="notification-title">{countNotification} Notifications <span className="read-all">Read all</span> </h3>
                </div>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    {notifications && notifications.map((item) => (
                        <ListItem alignItems="flex-start">
                            
                                <ListItemText
                                    style={{color:"#ffdeed!important"}}
                                    primary={<React.Fragment>
                                        {/* <Badge  onClick={() => checkedNotification(item['id'])} color="info" variant="dot" invisible={item['status'] === 0 ? false : true}anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                            }} style={{cursor:"pointer"}}> */}
                                          <Typography onClick={() => checkedNotification(item['id'])} style={{cursor:"pointer"}}>{item['title']}</Typography>
                                          {/* </Badge> */}
                                        <button type="button" className="close" data-dismiss="modal">
                                            <span>×</span>
                                        </button>
                                    
                                    </React.Fragment>}
                                secondary={
                                    <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        style={{color:"rgb(135 135 133)"}}
                                    >
                                        {item['description']}                                
                                    </Typography>
                                    </React.Fragment>
                                }                        
                                />
                        </ListItem>
                    ))}                    
                    
                </List>
            </Popover>
            <Popover
                id={id2}
                open={open2}
                anchorEl={anchorE2}
                onClose={handleClose2}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical:'bottom',
                    horizontal: 'center',
                }}
                backdropInvisible={false}
                className="popover_class"
            >
                <MenuList style={{backgroundColor:"#EFF0F6", paddingLeft:20, paddingRight:20}}>
                    <Link to="/profile">
                        <MenuItem>             
                            <ListItemText>Profile</ListItemText>
                            <ListItemIcon>
                                <ArrowForwardIosIcon fontSize="small" />
                            </ListItemIcon>                        
                        </MenuItem>
                    </Link>
                    <MenuItem onClick={logOutHandle}>                        
                        <ListItemText>Log out</ListItemText>
                        <ListItemIcon>
                            <ArrowForwardIosIcon fontSize="small" />
                        </ListItemIcon>                        
                    </MenuItem>                    
                </MenuList>
            </Popover>
        </div>
    )
}
