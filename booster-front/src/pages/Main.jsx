import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPlus, faFile } from '@fortawesome/free-solid-svg-icons';

import classes from './css/main.module.css'

import RecordGripper from '../components/RecordGripper/RecordGripper';
import RecordEditorWindow from '../components/RecordEditors/RecordEditorWindow/RecordEditorWindow';
import RecordFactory from '../components/RecordFactory/RecordFactory';

import { validateRecord } from '../utils/validate/validate';

import PathContext from '../context/PathContext';


const MainPage = () => {
    const { filePath } = useContext(PathContext)

    const [records, setRecords] = useState([])
    const [activeRecord, setActiveRecord] = useState(-1)
    const [recordCount, setRecordCount] = useState(0)

    const [saveFlag, setSaveFlag] = useState(false)

    useEffect(() => {
        setRecordCount(records.length)
    }, [records])

    useEffect(() => {
        async function getRecords() {
            const result = await window.api.getRecordList()
            return result
        }

        async function processResult() {
            const result = await getRecords()
            if (result) {
                const recordList = result.map((record, index) => {
                    return { id: index, product: record, valid: true }
                })

                setRecordCount(recordList.length)
                setRecords(recordList)
            }
        }

        processResult()
    }, [])

    useEffect(() => {
        async function writeTofile(recordList) {
            await window.api.saveRecordList(recordList)
        }

        if (saveFlag) {
            const newArray = records
                .filter(element => {
                    if (element.valid) return element
                })
                .map(element => element.product)

            writeTofile(newArray)
            setSaveFlag(false)
        }

    }, [saveFlag])

    function save(record) {
        // if valid returns true otherwise false 
        const isValid = validateRecord(record.product)
        record = isValid ? { ...record, valid: true } : { ...record, valid: false }

        let newArray = [...records];
        newArray[record.id] = record;
        setRecords(newArray)
        setSaveFlag(true)
    }

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
                                setRecords={setRecords}
                                activeRecord={activeRecord}
                                setSaveFlag={setSaveFlag}
                            />
                        })
                    }
                </div>

                <div className={classes.recordCountContainer}>
                    {
                        filePath
                            ?
                            <>
                                <span>Record count: </span>
                                <span>{recordCount}</span>
                            </>
                            :
                            <span>No file selected</span>
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

            <section className={classes.contentPanel}>
                <div className={classes.contentMainSection}>

                    {/* Workaround that allows to change displayed record based on variable "activeRecord" */}
                    {
                        records.map((currentRecord) => {
                            return activeRecord === currentRecord.id
                                ? <RecordEditorWindow
                                    currentRecord={currentRecord}
                                    saveCallback={save}
                                />
                                : null
                        })
                    }

                    {/* if none of the records are selected fatory will appear */}
                    {
                        activeRecord === -1
                            ? <RecordFactory records={records} setRecords={setRecords} />
                            : null
                    }

                </div>
            </section>
        </main>

    );
};

export default MainPage;