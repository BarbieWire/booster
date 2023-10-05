import React, { useState } from 'react';

import classes from "./RecordFactory.module.css"

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const RecordFactory = () => {
    const [recordName, setRecordName] = useState('')

    function handleNameChange(e) {
        setRecordName(e.target.value);
    };

    async function appendRecord() {
        await window.api.executeActionOnRecords("append", {name: recordName})
        setRecordName("")
    }

    return (
        <>
            <span className={classes.watermark}>Booster By Barbiewir3❤️</span>

            <div className={classes.promptContainer}>
                <div className={classes.boxShadow}>
                    <input
                        type="text"
                        className={classes.prompt}
                        placeholder='Send me a name'
                        value={recordName}
                        onChange={handleNameChange}
                    />
                    <button onClick={appendRecord} className={classes.submitNameButton} disabled={!recordName}>
                        <FontAwesomeIcon icon={faCheck} className={`fontawesome-icon ${classes.submitIcon}`} />
                    </button>
                </div>
                <span className={classes.promptHint}>input your text here in russian language</span>
            </div>
        </>
    );
};

RecordFactory.propTypes = {

};

export default RecordFactory;