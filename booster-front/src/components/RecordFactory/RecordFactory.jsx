import React, { useState } from 'react';

import classes from "./RecordFactory.module.css"

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import template from './RecordTemplate.json';

import _ from 'lodash';


const RecordFactory = ({ setRecords, setActiveRecord }) => {
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

            const newRecordObject = { id: newId, product: newRecord, valid: false }

            setActiveRecord(newRecordObject)
            return [...records, newRecordObject]
        })

        setRecordName("")
    }

    return (
        <>
            <span className={classes.watermark}>Booster By Barbiewir3❤️</span>

            <div className={classes.promptContainer}>
                <form onSubmit={appendRecord} className={classes.boxShadow}>
                    <input
                        type="text"
                        className={classes.prompt}
                        placeholder='Enter product title'
                        value={recordName}
                        onChange={handleNameChange}
                    />
                    <button className={classes.submitNameButton} disabled={!recordName} type="submit">
                        <FontAwesomeIcon icon={faCheck} className={`fontawesome-icon ${classes.submitIcon}`} />
                    </button>
                </form>
                <span className={classes.promptHint}>input your text here in any desired language</span>
            </div>
        </>
    );
};

RecordFactory.propTypes = {

};

export default RecordFactory;