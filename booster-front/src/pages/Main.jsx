import React from 'react';
import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import _ from 'lodash';

import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPlus, faFile, faCheck } from '@fortawesome/free-solid-svg-icons';

import Record from '../components/record/Record.jsx';

import classes from './css/main.module.css'

import JSONTemplate from '../template.js';


const MainPage = props => {
    const [records, setRecords] = useState([])
    const [currentPath, setCurrentPath] = useState()

    const [newRecordName, setNewRecordName] = useState('')
    const [activeRecord, setActiveRecord] = useState(0)

    async function retrieveCurrentPath() {
        const path = await window.api.retrieveCurrentFilePath()
        setCurrentPath(path)
    }

    async function getFormattedData() {
        const data = await window.api.receiveParsedXMLFromMain()
        setRecords(data)
    }

    function handleNameChange(e) {
        setNewRecordName(e.target.value);
    };

    useEffect(() => {
        retrieveCurrentPath()
        window.api.receiveRecordsList((event, result) => {
            console.log(result)
            setRecords(result)
        })
    }, [])

    useEffect(() => {
        if (currentPath) {
            getFormattedData()
        }
    }, [currentPath])


    async function appendRecord(object) {
        await window.api.executeActionOnRecords("append", object)
    }

    function createNewRecord() {
        const newProduct = _.cloneDeep(JSONTemplate);
        newProduct['title-ru']['__cdata'] = newRecordName

        if (records.length !== 0) {
            const newId = records[records.length - 1].id + 1
            const newRecord = {
                id: newId,
                product: newProduct
            }
            setNewRecordName("")
            setActiveRecord(newId)
            appendRecord(newRecord)
        } else {
            const newRecord = {
                id: 1,
                product: newProduct,
            }
            setRecords([newRecord])
            setNewRecordName("")
            setActiveRecord(1)

            appendRecord(newRecord)
        }
    }

    return (
        <main className={classes.layout}>
            <section className={classes.recordPanel}>
                <div className={classes.createNewRecordSection}>
                    <button className={classes.createNewRecordButton} onClick={() => setActiveRecord(0)}>
                        <span className={classes.buttonDecoration}>
                            <FontAwesomeIcon icon={faPlus} className={`fontawesome-icon ${classes.plusIcon}`} />
                            New Record
                        </span>
                    </button>
                </div>

                <div className={classes.recordSection}>
                    {
                        records.map(record => {
                            return <Record
                                key={record.id}
                                record={record}
                                setActiveRecord={setActiveRecord}
                                activeRecord={activeRecord}
                            />
                        })
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
                    {
                        !activeRecord
                            ? <span className={classes.watermark}>Booster By Barbiewir3❤️</span>
                            : null
                    }

                    {
                        activeRecord
                            ? <pre style={{ color: "white" }}>{JSON.stringify(records.filter((obj) => obj.id === activeRecord), null, 2)}</pre>
                            : null
                    }
                </div>
                {
                    !activeRecord
                        ?
                        <div className={classes.promptContainer}>
                            <div className={classes.boxShadow}>
                                <input
                                    type="text"
                                    className={classes.prompt}
                                    placeholder='Send me a name'
                                    value={newRecordName}
                                    onChange={handleNameChange}
                                />
                                <button onClick={createNewRecord} className={classes.submitNameButton} disabled={!newRecordName}>
                                    <FontAwesomeIcon icon={faCheck} className={`fontawesome-icon ${classes.submitIcon}`} />
                                </button>
                            </div>
                            <span className={classes.promptHint}>input your text here in russian language</span>
                        </div>
                        :
                        null
                }
            </section>
        </main>

    );
};

MainPage.propTypes = {

};

export default MainPage;