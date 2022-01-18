import React, {useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import { SideBar } from '../../components';
import { server } from "../../config/server";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { getAvatarGroupUtilityClass } from '@mui/material';
// import { BsLayoutSidebarReverse } from 'react-icons/bs';
const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#6308F7",
    borderRadius:15,
    width:300,
    '&:hover': {
      backgroundColor: "#6308F7",
    },
}));
const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#0063cc',
    borderColor: '#0063cc',
    fontFamily: [
        "poppins"
    ].join(','),
    '&:hover': {
        backgroundColor: '#0069d9',
        borderColor: '#0062cc',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#0062cc',
        borderColor: '#005cbf',
    },
    '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
});
let token = localStorage.getItem("token");
export const ProfilePage = () => {

    const [selectedFile, setSelectedFile] = React.useState(null);
    const [avatarStatus, setAvatarStatus] = React.useState(true);
    const [avatar, setAvatar] = React.useState(localStorage.getItem('userImage'));
    const [profileDescription, setProfileDescription] = React.useState(localStorage.getItem('profileDescription'));

    const [user, setUser] = React.useState([]);


    const [oldPassowrd, setOldPassword] = React.useState();
    const [newPassowrd, setNewPassword] = React.useState();
    const [confirmPassowrd, setConfirmPassword] = React.useState();

    const [type1, setType1] = React.useState("password");
    const [type2, setType2] = React.useState("password");
    const [type3, setType3] = React.useState("password");


    useEffect(() => {
        console.log(localStorage);
        setUser(localStorage.getItem('userImage'))
        getAvatar()
    }, [])

    const onFileChange = event => {
    
        // Update the state
        setSelectedFile(event.target.files[0]);
      
    };
    const getAvatar = () => {
        axios.get(server.serverURL + 'v1/profile', {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
        .then(res => {
            console.log(res.data)
            setUser(res.data.data)
            localStorage.setItem('userImage', res.data.data.avatar)
        });
    }
      // On file upload (click the upload button)
    const onFileUpload =  () => {
       if(avatarStatus == true){
           setAvatarStatus(false)
       }
       else {
            // Create an object of formData
            const formData = new FormData();
            formData.append('image',selectedFile)
        
            // Update the formData object
            // Details of the uploaded file
        
            // Request made to the backend api
            // Send formData object
            axios.post(server.serverURL + "v1/change-avatar", formData, {
                headers: {
                "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + token,
                },
            }).then(res => {
                localStorage.setItem('userImage', res.data.data.avatar);
                setAvatar(res.data.data.avatar);
            }) 
            setAvatarStatus(false)     
        }  
    }

    const changePasswordHandle = (e) => {
        if(e.target.name == "oldPassword") {
            setOldPassword(e.target.value)
        }
        else if(e.target.name == "newPassword") {
            setNewPassword(e.target.value)
        }
        else if(e.target.name == "confirmPassword") {
            setConfirmPassword(e.target.value)
        }
     }
     let formData = {
         "old_password": oldPassowrd,
         "new_password": newPassowrd,
         "confirm_new_password":confirmPassowrd
     }
     const changePassword = () => {
        axios.post(server.serverURL + "v1/change-password", formData, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
        }).then(res => {
            alert("error");
            if(res.data.data.message) {
                alert(res.data.data.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        }).catch(error => {
            alert(error)   
        }); 
    }

    const saveProfile = () => {
        const formData = {
            "profile_description":profileDescription
        }
        axios.post(server.serverURL + "v1/change-avatar", formData, {
            headers: {
            "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }).then(res => {
            localStorage.setItem('profileDescription', res.data.data.profile_description);
            setAvatar(res.data.data.avatar);
            setAvatarStatus(true);
        }) 
    }

    const changeProfile = (e) => {
        setProfileDescription(e.target.value);
    }

    const viewPass = (id) => {
        if(id == 1) {
            setType1("text")
        }
        else if(id == 2) {
            setType2("text")
        }
        else if(id == 3) {
            setType3("text");
        }
    }
    const nonePass = (e) => {
        setType1("password");
        setType2("password");
        setType3("password");
    }
    return(
        <div>
            <SideBar select={"profile"}/>
            <div className="profile-app justify-content-center">
                <div className="profile-form">
                    <div>
                        <h1 class="avatars-title-text" style={{fontSize:33}}>
                            Profile
                            <span style={{color: "rgb(57, 211, 227)"}}>.</span>
                        </h1>
                    </div>
                    <div className="d-flex flex-column justify-content-center" style={{margin:"auto"}}>
                            <div style={{textAlign:"center"}}>                            
                                <img className="profile-avatar img-circle avatar-size" src={avatar}/>                            
                                <div className="d-flex">
                                    <button className="btn btn-primary" onClick={onFileUpload}>
                                        <i className="fa fa-save"></i>
                                    </button>
                                    {!avatarStatus && <input  className="btn btn-default w-75 m-0" type="file" onChange={onFileChange} style={{display:avatarStatus}} />}
                                </div>      
                                <p className="profile-name pt-1">{localStorage.getItem("userName")}</p>                            
                            </div>
                        <div>
                            {avatarStatus && <textarea disabled className="profile-textfield form-control" style={{borderRadius:15, borderColor:"transparent"}} rows="5" cols="40">
                                {profileDescription}
                            </textarea>}
                            {!avatarStatus &&<textarea className="profile-textfield form-control" style={{borderRadius:15, borderColor:"transparent"}} onChange={changeProfile} rows="5" cols="40" placeholder="Profile - 2/200 words">
                                {profileDescription}
                            </textarea>}
                            <div className="w-25 btn btn-success" onClick={!avatarStatus && saveProfile} style={{float:"right", marginTop:12, marginBottom:12, paddingBottom:12, paddingTop:12, borderRadius:32, backgroundColor:"#6308F7", borderColor:"#6308F7"}}>Save</div>
                        </div>
                    </div>
                </div>
                <div className="profile-form ml-2">
                    <div>
                        <h1 class="avatars-title-text" style={{fontSize:33}}>
                            Login & Password
                            <span style={{color: "rgb(57, 211, 227)"}}>.</span>
                        </h1>
                    </div>
                    <div style={{paddingTop:15}}>
                        <div className="Icon-inside">
                            <input type="email" placeholder="Email address" className="profile-input" value={user['email']} disabled/>                                         
                        </div>
                        <div className="Icon-inside">
                            <input type={type1} name="oldPassword" placeholder="Old Password" className="profile-input" value={oldPassowrd}  onChange={changePasswordHandle}/>
                            <i class="fa fa-eye fa-lg fa-fw" name="oldPassword" aria-hidden="true" style={{cursor:"pointer"}} onMouseDown={() => viewPass(1)} onMouseUp={nonePass}></i>  
                        </div>
                        <div className="Icon-inside">
                            <input type={type2} name="newPassword" placeholder="New Password" className="profile-input" value={newPassowrd} onChange={changePasswordHandle}/>
                            <i class="fa fa-eye fa-lg fa-fw" name="newPassword" aria-hidden="true" style={{cursor:"pointer"}} onMouseDown={() => viewPass(2)} onMouseUp={nonePass}></i>  
                        </div>
                        <div className="Icon-inside">
                            <input type={type3} name="confirmPassword" placeholder="Confirm Password" className="profile-input" value={confirmPassowrd} onChange={changePasswordHandle}/>
                            <i class="fa fa-eye fa-lg fa-fw"  name="confirmPassword" aria-hidden="true" style={{cursor:"pointer"}} onMouseDown={() => viewPass(3)} onMouseUp={nonePass}></i> 
                        </div>
                    </div>
                    <div>
                        <div className="w-25 btn btn-success" style={{float:"right", marginTop:12, marginBottom:12, paddingBottom:12, paddingTop:12, borderRadius:32, backgroundColor:"#6308F7", borderColor:"#6308F7"}} onClick={changePassword}>Change</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

