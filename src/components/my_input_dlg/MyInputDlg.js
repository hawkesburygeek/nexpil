import React, { useState } from 'react'
import { confirmable } from 'react-confirm';

function MyInputDlg(props) {
    const { show, proceed, content } = props;
    const [inputValue, setInputValue] = useState("");
    return (
        <div>
            <Modal show={show} onHide={() => proceed("")} className="my-confirm-dialog-style">
                {/* <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    <div >
                        <div className="confirm-modal-content-container">
                            {content}
                            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        </div>
                        <div className="modal-button-container">
                            <div className="confirm-modal-ok-button primary-button" onClick={() => proceed(inputValue)}>
                                <p className="doctor-notes-button-text">OK</p>
                            </div>
                            <div className="confirm-modal-cancel-button discard-button" onClick={() => proceed("")}>
                                <p className="doctor-notes-button-text">Cancel</p>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default confirmable(MyInputDlg);
// export default MyInputDlg
