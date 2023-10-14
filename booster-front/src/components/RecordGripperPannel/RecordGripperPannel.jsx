import React, { useContext, useState } from 'react';

import { NavLink } from "react-router-dom";

import PathContext from '../../context/PathContext';

import classes from './RecordGripperPannel.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus, faGear, faPlus, faFile } from '@fortawesome/free-solid-svg-icons';
import UserMessagesContext from '../../context/UserMessagesContext';


const RecordGripperPannel = ({
    records,
    setRecords,

    activeRecord,
    setActiveRecord,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { filePath } = useContext(PathContext)
    const { createMessageHelper } = useContext(UserMessagesContext)

    function deleteRecord(event, deletionIndex) {
        event.stopPropagation()

        let newRecordList = records.filter(record => record.id !== deletionIndex)
        newRecordList = newRecordList.map((record, index) => {
            return { ...record, id: index }
        })

        setActiveRecord()
        setRecords(newRecordList)
        createMessageHelper("success", "Record has been deleted succesfully", "deleteRecord")
    }


    const filteredItems = searchQuery
        ? records.filter((item) => {
            return item.product["title-ru"]["__cdata"] && item.product["title-ru"]["__cdata"].toLowerCase().includes(searchQuery.toLowerCase())
        })
        : records;


    console.log(filteredItems)

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };


    return (
        <section className={classes.recordPanel}>
            <div className={classes.createNewRecordSection}>
                <button className={classes.createNewRecordButton} onClick={() => setActiveRecord()}>
                    <span className={classes.buttonDecoration}>
                        <FontAwesomeIcon icon={faPlus} className={`fontawesome-icon ${classes.plusIcon}`} />
                        New Record
                    </span>
                </button>
            </div>
            <div className={classes.createNewRecordSection}>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleInputChange}
                    className={classes.searchBar}
                />
            </div>

            <div className={classes.recordSection}>
                {
                    filteredItems.map((record, index) => {
                        return <div
                            className={activeRecord && activeRecord.id === record.id ? `${classes.block} ${classes.active}` : classes.block}
                            onClick={() => setActiveRecord(record)}
                            key={`rec_${index}`}
                        >
                            <button className={classes.deleteRecord} onClick={(event) => deleteRecord(event, record.id)}>
                                <FontAwesomeIcon icon={faSquareMinus} className={classes.rmv} />
                            </button>
                            <span className={classes.name}>
                                <div className={classes.fadingText}></div>
                                {record.product["title-ru"]["__cdata"]}
                            </span>
                        </div>
                    })
                }
            </div>

            <div className={classes.recordCountContainer}>
                {
                    filePath
                        ? <>
                            <span>Record count: </span>
                            <span>{records.length}</span>
                        </>
                        : <span>No file selected</span>
                }
            </div>

            <div className={classes.settingSection}>
                <NavLink to='/settings' className={classes.setting}>
                    <FontAwesomeIcon icon={faGear} className={`fontawesome-icon ${classes.menuIcon}`} />
                </NavLink>

                <NavLink to='/file' className={`${classes.setting} ${classes.settingsWide}`}>
                    <FontAwesomeIcon icon={faFile} className={`fontawesome-icon ${classes.menuIcon}`} />
                    <span className={classes.buttonText}>Manage file</span>
                </NavLink>
            </div>
        </section>
    );
};

RecordGripperPannel.propTypes = {

};

export default RecordGripperPannel;
