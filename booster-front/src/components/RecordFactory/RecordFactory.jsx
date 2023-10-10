import React, { useState } from 'react';

import classes from "./RecordFactory.module.css"

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import template from './RecordTemplate.json';

import _ from 'lodash';


const RecordFactory = ({ setRecords }) => {
    const [recordName, setRecordName] = useState('')

    function handleNameChange(e) {
        setRecordName(e.target.value);
    };

    async function appendRecord() {
        setRecords(records => {
            const newRecord = _.cloneDeep(template)
            newRecord["title-ru"]["__cdata"] = recordName
            let newId = 0
            if (records.length > 0) newId = records[records.length - 1].id + 1
            return [...records, { id: newId, product: newRecord, valid: false }]
        })

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
                <span className={classes.promptHint}>input your text here in any desired language</span>
            </div>
        </>
    );
};

RecordFactory.propTypes = {

};

export default RecordFactory;