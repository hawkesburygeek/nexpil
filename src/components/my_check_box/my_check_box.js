import React from 'react'
import './my_check_box.css'
function MyCheckBox(props) {
    const { isChecked, setIsChecked, isFromChat } = props;
    const onChange = (v) => {

    }
    return (
        <div>
            <span className="checkbox">
                <input type="checkbox" checked={isChecked} onChange={onChange} />
                <span className="wrapper" onClick={() => setIsChecked(!isChecked)}>
                    <span className="knob"></span>
                </span>
            </span>
            <span className="checkbox-description" style={{ fontSize: isFromChat ? 18 : 20 }}>I will save this set as template.</span>
        </div>
    )
}

export default MyCheckBox
