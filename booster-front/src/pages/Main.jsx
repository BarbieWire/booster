import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPlus, faFile } from '@fortawesome/free-solid-svg-icons';

import classes from './css/main.module.css'

import RecordGripper from '../components/RecordGripper/RecordGripper';
import RecordEditorWindow from '../components/RecordEditors/RecordEditorWindow/RecordEditorWindow';
import RecordFactory from '../components/RecordFactory/RecordFactory';


const MainPage = () => {
    const [records, setRecords] = useState([])
    const [activeRecord, setActiveRecord] = useState(-1)
    const [recordCount, setRecordCount] = useState(0)

    useEffect(() => {
        const listener = (event, result) => {
            const recordList = result.map((record, index) => {
                return { id: index, product: record }
            })

            setRecordCount(recordList.length)
            setRecords(recordList)
        }
        window.api.receiveRecordList(listener)
        return () => {
            window.api.removeEventListener('return-record-list', listener);
        }
    }, [])

    useEffect(() => {
        async function getFormattedData() {
            await window.api.executeActionOnRecords("retrieve")
        }

        getFormattedData()
    }, [])

    return (
        <main className={classes.layout}>
            <section className={classes.recordPanel}>
                <div className={classes.createNewRecordSection}>
                    <button className={classes.createNewRecordButton} onClick={() => setActiveRecord(-1)}>
                        <span className={classes.buttonDecoration}>
                            <FontAwesomeIcon icon={faPlus} className={`fontawesome-icon ${classes.plusIcon}`} />
                            New Record
                        </span>
                    </button>
                </div>

                <div className={classes.recordSection}>
                    {
                        records.map(record => {
                            return <RecordGripper
                                key={record.id}
                                record={record}
                                setActiveRecord={setActiveRecord}
                                activeRecord={activeRecord}
                            />
                        })
                    }
                </div>

                <div className={classes.recordCountContainer}>
                    <span>Record count: </span>
                    <span>{recordCount}</span>
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

            <section className={classes.contentPanel}>
                <div className={classes.contentMainSection}>

                    {/* Workaround that allows to change displayed record based on variable "activeRecord" */}
                    {
                        records.map((currentRecord) => {
                            return activeRecord === currentRecord.id
                                ? <RecordEditorWindow currentRecord={currentRecord} />
                                : null
                        })
                    }

                    {/* if none of the records are selected fatory will appear */}
                    {
                        activeRecord === -1
                            ? <RecordFactory />
                            : null
                    }

                </div>
            </section>
        </main>

    );
};

export default MainPage;