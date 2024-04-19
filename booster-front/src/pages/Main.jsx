import React from 'react';
import { useState, useEffect } from 'react';
import { useActiveRecord } from '../hooks/useRecord';

import RecordGripperPannel from '../components/RecordGripperPannel/RecordGripperPannel';
import ContentPanel from '../components/ContentPanel/ContentPanel';

import classes from './css/Main.module.css'

import '../../src/common/css/buttons.css'
import '../../src/common/css/selects.css'


const MainPage = () => {
    const [records, setRecords] = useState([])
    const [activeRecord, setActiveRecord] = useActiveRecord()
    const [saveFlag, setSaveFlag] = useState(false)

    const [recordsLoading, setRecordsLoading] = useState(false)

    useEffect(() => {
        async function getRecords() {
            const result = await window.api.getRecordList()
            return result
        }

        async function processResult() {
            setRecordsLoading(true)
            const result = await getRecords()
            if (result) {
                const recordList = result.map((record, index) => {
                    return { id: index, product: record, valid: true }
                })

                setRecords(recordList)
            }
            setRecordsLoading(false)
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
                    return undefined
                })
                .map(element => element.product)

            writeTofile(newArray)
            setSaveFlag(false)
        }
    }, [records, saveFlag])

    return (
        <main className={classes.layout}>
            <RecordGripperPannel
                setActiveRecord={setActiveRecord}
                activeRecord={activeRecord.values.record}

                records={records}
                setRecords={setRecords}

                setSaveFlag={setSaveFlag}
            />

            <ContentPanel
                activeRecord={activeRecord}
                setActiveRecord={setActiveRecord}

                records={records}
                setRecords={setRecords}

                setSaveFlag={setSaveFlag}
            />

            {
                (recordsLoading) && <div className={classes.tonedBackground}>
                    <div className={classes.ldsEllipsis}><div></div><div></div><div></div><div></div></div>
                </div>
            }

        </main>

    );
};

export default MainPage;