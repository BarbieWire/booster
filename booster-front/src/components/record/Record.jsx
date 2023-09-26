import React from 'react';
import PropTypes from 'prop-types';

import classes from './Record.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus } from '@fortawesome/free-solid-svg-icons';



const Record = ({ record, setActiveRecord, activeRecord}) => {
    async function deleteRecord(e) {
        e.stopPropagation()
        await window.api.executeActionOnRecords("remove", record)
        if (record.id === activeRecord) {
            setActiveRecord(0)
        }
    }

    const highligh = activeRecord === record.id ? `${classes.block} ${classes.active}` : classes.block

    return (
        <div className={highligh} onClick={() => setActiveRecord(record.id)}>
            <button className={classes.deleteRecord} onClick={(e) => deleteRecord(e)}>
                <FontAwesomeIcon icon={faSquareMinus} className={classes.rmv}/> 
            </button>
            <span className={classes.name}>
                <div className={classes.fadingText}></div>
                {record.product["title-ru"]["__cdata"]}, {record.id}
            </span>
        </div>
    );
};

Record.propTypes = {

};

export default Record;