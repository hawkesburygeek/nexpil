import React from 'react'
import { Modal } from 'react-bootstrap'
import './MyAlertDlg.css'
import { confirmable } from 'react-confirm';
function MyAlertDlg(props) {
    const { show, proceed, content } = props;
    return (
        <div>
            <Modal show={show} onHide={() => proceed(true)} className="my-confirm-dialog-style">
                {/* <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    <div >
                        <div className="confirm-modal-content-container">
                            {content}
                        </div>
                        <div className="modal-button-container">
                            <div className="confirm-modal-ok-button primary-button" onClick={() => proceed(true)}>
                                <p className="doctor-notes-button-text">OK</p>
                            </div> 

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default confirmable(MyAlertDlg);
