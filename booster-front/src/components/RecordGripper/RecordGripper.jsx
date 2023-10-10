import React from 'react';
import PropTypes from 'prop-types';

import classes from './RecordGripper.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus } from '@fortawesome/free-solid-svg-icons';



const RecordGripper = ({ record, setActiveRecord, activeRecord, setRecords, setSaveFlag }) => {
    function deleteRecord(e) {
        e.stopPropagation()

        setRecords(records => {
            const newRecordList = records
                .filter(current => record.id !== current.id)
                .map((record, index) => {
                    return { ...record, id: index }
                })

            return newRecordList
        })
        setActiveRecord(-1)
        setSaveFlag(true)
    }

    const highligh = activeRecord === record.id ? `${classes.block} ${classes.active}` : classes.block

    return (
        <div className={highligh} onClick={() => setActiveRecord(record.id)}>
            <button className={classes.deleteRecord} onClick={deleteRecord}>
                <FontAwesomeIcon icon={faSquareMinus} className={classes.rmv} />
            </button>
            <span className={classes.name}>
                <div className={classes.fadingText}></div>
                {record.product["title-ru"]["__cdata"]}
            </span>
        </div>
    );
};

RecordGripper.propTypes = {

};

export default RecordGripper;