import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import { Icon } from '@iconify/react';
import phoneHangUp from '@iconify/icons-icomoon-free/phone-hang-up';

import { Link } from "react-router-dom";
const Room = ({ roomName, token, handleLogout }) => {

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [switchs, setswitchs] = useState(false);

  useEffect(() => {
    if (token) {
      const participantConnected = participant => {
        setParticipants(prevParticipants => [...prevParticipants, participant]);
      };

      const participantDisconnected = participant => {
        setParticipants(prevParticipants =>
          prevParticipants.filter(p => p !== participant)
        );
      };

      Video.connect(token, {
        name: roomName
      }).then(room => {
        setRoom(room);
        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);
        room.participants.forEach(participantConnected);
      });

      return () => {
        setRoom(currentRoom => {
          if (currentRoom && currentRoom.localParticipant.state === 'connected') {
            currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
              trackPublication.track.stop();
            });
            currentRoom.disconnect();
            return null;
          } else {
            return currentRoom;
          }
        });
      };
    }
  }, [roomName, token]);

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} isRecipient={true} />
  ));

  /* console.log(room, "room")
  console.log(participants, "particpants") */

  return (
    <div className="room" style={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
      borderRadius: "40px"
    }}>
      {remoteParticipants}
      <div className="remote-participants" style={{
        position: "absolute",
        width: "150px",
        height: "150px",
        bottom: "10%",
        right: "10%",
        overflow: "hidden",
        borderRadius: "50%"
      }}>
        
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
            isRecipient={switchs}
          />
        ) : null}
      </div>
      <div style={{ position: "absolute", right: "50%", bottom: "2%", cursor: "pointer" }} onClick={handleLogout} className="video-hang-button">
        <Icon color="white" fontSize="30px" icon={phoneHangUp} />
      </div>
    </div>
  );
};

export default Room;


