import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import './style.scss';
import { BsFillCameraVideoFill, BsPlus } from "react-icons/bs";
import { Icon } from '@iconify/react';
import bxsMessage from '@iconify/icons-bx/bxs-message';
import { server } from "../../config/server";
import axios from 'axios';
import TwilioChat from 'twilio-chat'
import jwt from 'jwt-simple';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Loading from 'react-loading';
import { showAlert } from '../my_alert_dlg/showAlertDlg';

var sentImage = "";
var receivedImage = "";

export const ChatWindow = ({ page, setVideoCall, chatInfo, roomName }) => {    

    const currentUrl = window.location.href;
    const dispatch = useDispatch();
    const [chatTexts, setChatTexts] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [channelName, setChannelName] = useState("");
    const [chatToken, setChatToken] = useState("")
    const [videoToken, setVideoToken] = useState("");
    const [smsTo, setSmsTo] = useState("");
    const [smsBody, setSmsBody] = useState("");
    // const [ setFriendly ] = useState("")
    /* const [ receiver, setReceiver ] = useState('') */
    const [chatUserInfo, setChatUserInfo] = useState("");
    const [show, setShow] = useState(false);
    const messagesEndRef = useRef();
    const [loading, setLoading] = useState(true);
    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    }
    /*   console.log("chat text", chatTexts) */
    useEffect(() => {
        if (page) {
            setChatTexts([]);
            configureChannelEvents();
            /*  chatInfoValidation(); */
        } else {
            if (chatInfo) {
                setChatTexts([]);
                chatInfoValidation();
            }
        }
        if(currentUrl.slice(-8) == "redirect") {
            // goVideoCall();
        }
    }, [chatInfo]);// eslint-disable-line react-hooks/exhaustive-deps

    const setChatImage = (data) => {
        sentImage = data["receiveImage"];
        receivedImage = data["sendImage"];
        userRoleValidation(data);
    }

    const userRoleValidation = (data) => {
        // if ((data["send"] === localStorage.userName) || (data["receive"] === localStorage.userName)) {
        setChannelName(data["channelName"]);
        getToken(data["channelName"])
            .then(createChatClient)
            .then(joinGeneralChannel)
            .then(configureChannelEvents)
            .catch((error) => {
                showAlert({ content: "Error: " + error.message });
            })
        // } else {
        //     showAlert({ content: "Please select the user" });
        // }
    }

    const chatInfoValidation = () => {
        let data = jwt.decode(chatInfo, "xxx");
        let obj = {};
        if (data.send === localStorage.userId) {
            obj = {
                send: data["send"],
                sendImage: data["sendImage"],
                receive: data["receive"],
                receiveImage: data["receiveImage"],
                channelName: data["channelName"],
                receiver: data["receiver"],
                phone_number: data["r_phone_number"],
                date: data["date"],
                userInfo: data["userInfo"],


            }

            /*  setFriendly(data["friendlyName"])
             console.log("friendly", friendly) */

            dispatch({ type: 'GET_USER_CHAT', payload: data["userInfo"] });
            dispatch({ type: 'GET_PATIENT_MEDICATION_DATA', payload: data["userInfo"].id });
            dispatch({ type: 'GET_ASSIGNED_DATA', payload: data["userInfo"].id });
        } else {
            obj = {
                send: data["send"],
                sendImage: data["sendImage"],
                receive: data["receive"],
                receiveImage: data["receiveImage"],
                channelName: data["channelName"],
                receiver: data["sender"],
                phone_number: data["s_phone_number"],
                date: data["date"],
                userInfo: {}
            }
        }
        setChatUserInfo(obj);
        setChatImage(obj);
    }

    const getToken = (channelName) => {
        return new Promise((resolve, reject) => {

            resolve(getChatToken(channelName))
        }

        )
    }

    const getChatToken = (channelName) => {
        config.body = {};
        /*  console.log("channel name", channelName) */
        return new Promise((resolve, reject) => {
            axios.post(server.serverURL + 'v1/twilio-token', {
                "identity": `Dr_${localStorage.userId}`
            }, config)
                .then(res => {
                    let chatToken = res.data.token
                    setChatToken(res.data.token)
                    resolve({ chatToken, channelName });
                    /*  resolve(getVideoToken(channelName, data.token));
                     console.log("data token", data.token, videoToken ) */
                });
        })
    }


    const getVideoToken = (channelName) => {
        axios.post(server.serverURL + 'v1/video-token', {
            "room": channelName,
            "name": `Dr_${localStorage.userId}`
        }, config)
            .then(res => {
                var data = res.data;
                /*   console.log("res", data.token) */
                setVideoToken(data.token);
                // resolve({chatToken, channelName});
                // sendVideoNotification(data.token)
            });

    }

    const sendVideoNotification = (twilioVideoToken) => {

        let obj = {
            patient_id: chatUserInfo["receive"],
            title: `Time to Call ${localStorage.userName}`,
            body: `Your Telemedicine call with ${localStorage.userName} starts soon. Click here to began the Call`,
            notification_id: "2",
            room_name: channelName
        }
        /*  console.log("obj", obj, config) */
        axios.post(server.serverURL + 'v1/push-notify', obj, config)
            .then(res => {
                // var data = res.data;
                /*   console.log("video HERE", twilioVideoToken) */
                setVideoCall(twilioVideoToken, channelName);

            });
    }

    const goVideoCall = () => {
        if (loading === true && chatUserInfo) {
            showAlert({ content: "loading..." });
        } else if (!window.channel) {
            showAlert({ content: "Please select the user" });
        } else {
            /*  console.log(videoToken, "videoToken") */
            if (videoToken) {
                sendVideoNotification(videoToken);
            } else {
                getVideoToken(channelName)

            }
        }
    }

    const createChatClient = (data) => {
        /*  console.log(data, "data") */
        return new Promise((resolve, reject) => {
            let channelName = data["channelName"];
            let chatClient = new TwilioChat(data["chatToken"]);
            /*     console.log("chatclient", chatClient) */
            resolve({ chatClient, channelName });

        })
    }

    const joinGeneralChannel = ({ chatClient, channelName }) => {
        return new Promise((resolve, reject) => {
            chatClient.getSubscribedChannels().then(() => {
                chatClient.getChannelByUniqueName(channelName).then((channel) => {
                    window.channel = channel;
                    channel.join().then(() => {
                        window.addEventListener('beforeunload', () => channel.leave())
                        resolve(channel);
                    }).catch(() => reject(Error('Could not join general channel.')))
                }).catch((e) => createGeneralChannel(chatClient, channelName, e))
            }).catch(() => reject(Error('Could not get channel list.')))
        })
    }
    // console.log("receiver", receiver)
    // console.log("string", [receiver.id].toString())
    // console.log("string 1", String(receiver.id))


    const createGeneralChannel = (chatClient, channelName, e, data) => {
        return new Promise((resolve, reject) => {
            chatClient
                .createChannel({ uniqueName: channelName, friendlyName: localStorage.userName })
                .then((channel) => {
                    window.channel = channel;
                    channel.join().then(() => {
                        /*  let strPatientId = String(receiver.id) */
                        let identity = channelName.split("/")[1]
                        /* console.log("channel", channel) */
                        axios.post(server.serverURL + 'v1/create-member-resource', {

                            "identity": identity,
                            "channel_id": channel.sid,

                        }, config)/* .then(res => console.log("ressss", res)) */
                        /* .catch(err => console.log(`${err} in creating member`)) */
                        /*  channel.add(strPatientId).catch((error) =>console.log("Errorrrr - ", error)) */


                        window.addEventListener('beforeunload', () => channel.leave())
                        resolve(channel);
                    }).catch(() => reject(Error('Could not join general channel.')))
                })
                .catch((e) => {
                    console.log(e);
                })
        })
    }

    const configureChannelEvents = () => {
        window.channel.getMessages().then(messagesLoaded).then((msg) => {
            window.channel.on('messageAdded', ({ author, body }) => {
                let messageData = messageAdded(author, body, msg);
                /* console.log("author, body,data", messageData) */
                setMessageHistory(messageData);
            })
            let data = jwt.decode(chatInfo, "xxx");
            let obj = {
                send: data["send"],
                sendImage: data["sendImage"],
                receive: data["receive"],
                receiveImage: data["receiveImage"],
                channelName: data["channelName"],
                receiver: data["receiver"],
                phone_number: data["r_phone_number"],
                date: data["date"],
                userInfo: data["userInfo"],


            }
            setChatUserInfo(obj);

            // window.channel.on('memberJoined', (member) => {
            //     alert(member.identity + " has joined the channel");
            // })

            // window.channel.on('memberLeft', (member) => {
            //     alert(member.identity + " has left the channel.");
            // })
        });
    }

    const messagesLoaded = messagePage => {
        let messageHistory = [];
        for (let index = 0; index < messagePage.items.length; index++) {
            let element = messagePage.items[index];
            let messageHistoryRecord;
            if (element.author === `Dr_${localStorage.userId}` || element.author === localStorage.userId) {
                messageHistoryRecord = {
                    key: "sent",
                    text: element.body
                }
            } else {
                messageHistoryRecord = {
                    key: "received",
                    text: element.body
                }
            }
            messageHistory.push(messageHistoryRecord);
        }
        messageHistory = messageHistory.reverse();
        setChatTexts(messageHistory);
        setLoading(false);
        return messageHistory;
    };

    const messageAdded = (author, message, messageHistory) => {
        let virtualChatTexts = messageHistory;
        let chatRowRecord = {};
        if (author === `Dr_${localStorage.userId}` || author === localStorage.userId) {
            chatRowRecord = {
                key: "sent",
                text: message
            }
        } else {
            chatRowRecord = {
                key: "received",
                text: message
            }
        }
        virtualChatTexts.unshift(chatRowRecord);
        return virtualChatTexts;
    };

    const setMessageHistory = (data) => {
        setChatTexts(data);
        setNewMessage(".");
        setNewMessage("");
    }

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    const sendMessageToDB = (message) => {
        let obj = {
            sender_id: chatUserInfo["send"],
            recipient_id: chatUserInfo["receive"],
            body: message,
            chat_by: 1
        }
        /*    console.log("send msg onj", obj) */
        axios.post(server.serverURL + 'v1/messages', obj, config)
            .then(res => {
                // var data = res.data;
            });
    }

    const sendNotification = (message) => {
        let obj = {
            patient_id: chatUserInfo["receive"],
            title: localStorage.userName,
            body: message,
            notification_id: 1,
            channel_name: channelName || roomName
        }
        /* console.log("obj", obj) */
        axios.post(server.serverURL + 'v1/push-notify', obj, config)
            .then(res => {
                // var data = res.data;
                /*  console.log("notification", data) */
            });
    }

    const onSendMessage = () => {
        if (newMessage === "" && chatUserInfo && loading === false) {
            showAlert({ content: "You can't send blank" });
        } else if (loading === true && chatUserInfo) {
            showAlert({ content: "loading..." });
        } else if (!window.channel) {
            showAlert({ content: "Please select the user" });
        } else if (window.channel) {
            window.channel.getUserDescriptors()
                .then(res => {
                    let users = res.state.items.filter(i => {
                        return i.identity !== `Dr_${localStorage.userId}`
                    })
                    console.log("res.state.items:::", res.state.items)
                    console.log("users:::", users)
                    if (Array.isArray(users) && users[0] && users[0].online) {
                        sendNotification(newMessage)
                    }
                    /*   console.log("onlineSTatus", users[0].online) */
                })


            window.channel.sendMessage(newMessage);
            scrollToBottom();
            sendMessageToDB(newMessage);

        }
    }

    const onMessageChanged = (event) => {
        setNewMessage(event.target.value);
    };

    const onSendKeyEvent = (event) => {
        if (event.key === "Enter") {
            onSendMessage();
        }
    }
    /*   console.log("smsto n body", smsTo, smsBody) */

    const onSendSMS = () => {
        axios.post(server.serverURL + 'v1/sms-send', {
            "to": smsTo,
            "body": smsBody
        }, config)
            .then(res => {
                /*  console.log("res", res) */
                // var data = res.data;
                setShow(false);
            })
            .catch(err => console.log(`${err} while sending sms`))
    }

    const onhandleSMSClose = () => setShow(false);

    const onhandleSMSShow = () => {
        if (loading === true && chatUserInfo) {
            showAlert({ content: "loading..." });
            return false;
        } else if (!window.channel) {
            showAlert({ content: "Please select the user" });
            return false;
        } else {
            setSmsTo(chatUserInfo["phone_number"]);
            setShow(true);
        }
    }

    const onSMSMessageHandleChange = (event) => {
        setSmsBody(event.target.value);
    }

    return (
        <div className="chat-main-part">
            <Modal show={show} onHide={onhandleSMSClose}>
                <Modal.Header closeButton>
                    <Modal.Title>SMS Send to the User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Message</Form.Label>
                            <Form.Control name="smsBody" onChange={onSMSMessageHandleChange} as="textarea" rows="3" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onhandleSMSClose}>
                        CLOSE
                </Button>
                    <Button variant="primary" onClick={onSendSMS}>
                        SMS SEND
                </Button>
                </Modal.Footer>
            </Modal>
            <div className="chat-user-name">
                <div className="chat-patient-name-title">
                    {chatUserInfo && <p className="chat-patient-name">{chatUserInfo.receiver + " " + chatUserInfo.date}</p>}
                    {!page && <p className="chat-user-net-state">Online</p>}
                </div>
                <div className="row" style={{ marginRight: "10px" }}>
                    {!page &&
                        <>
                            <div onClick={onhandleSMSShow} style={{ marginRight: "30px", display: "none" }} className="video-call-button">
                                <Icon color="white" icon={bxsMessage} />
                            </div>
                            <div onClick={goVideoCall} className="video-call-button">
                                <BsFillCameraVideoFill color="white" size="15px" />
                            </div>
                        </>
                    }
                </div>
            </div>
            { (loading === true && chatUserInfo) &&
                <div style={{ margin: "auto" }}>
                    <Loading type="bars" color="#4939e3" />
                </div>
            }
            { loading === false &&
                <div className="chatApp__convTimeline" ref={messagesEndRef}>
                    {chatTexts.map((item, i) => {
                        return (
                            <div key={i} className={item.key === "received" ? "chatApp__convMessageItem chatApp__convMessageItem--left clearfix" : "chatApp__convMessageItem chatApp__convMessageItem--right clearfix"}>
                                <img src={item.key === "received" ? sentImage : receivedImage} alt="Shun" className="chatApp__convMessageAvatar" />
                                <div className="chatApp__convMessageValue">{item.text}</div>
                            </div>
                        );
                    }
                    )}
                </div>
            }
            <div className="chat-text-input-section">
                <div className="chat-text-input-plus-button">
                    <BsPlus size="20px" color="#4939E3" />
                </div>
                <div className="chat-text-input-div">
                    <input onKeyDown={onSendKeyEvent} onChange={onMessageChanged} value={newMessage} className="chat-text-input" type="text" placeholder="Type a message..." />
                    <p onClick={onSendMessage} className="chat-text-send-button">Send</p>
                </div>
            </div>
        </div>
    );
}

