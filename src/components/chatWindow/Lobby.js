import React from 'react';

const Lobby = ({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  handleSubmit
}) => {
  return (
    <form style={{width: "100%", height: "100%"}} onSubmit={handleSubmit}>
      <div className="container video-register col-3" >
        <div className="input-row row">
          <h2 >Enter a room</h2>
        </div>
        <div className="input-row row">
          <label htmlFor="name">Name:</label>
          <input className="add-inputs"
            type="text"
            id="field"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="input-row row">
          <label htmlFor="room">Room name:</label>
          <input className="add-inputs"
            type="text"
            id="room"
            value={roomName}
            onChange={handleRoomNameChange}
            required
          />
        </div>
        <div className="input-row row">
          <button className="primary-button" type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
};

export default Lobby;
