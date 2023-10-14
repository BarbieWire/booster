import React from 'react';
import { useState, useEffect } from 'react';
import { useActiveRecord } from '../hooks/useRecord';

import RecordGripperPannel from '../components/RecordGripperPannel/RecordGripperPannel';
import ContentPanel from '../components/ContentPanel/ContentPanel';

import classes from './css/main.module.css'


const MainPage = () => {
    const [records, setRecords] = useState([])
    const [activeRecord, setActiveRecord] = useActiveRecord()

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

                setRecords(recordList)
            }
        }

        processResult()
    }, [])

    useEffect(() => {
        async function writeTofile(recordList) {
            await window.api.saveRecordList(recordList)
        }

        const newArray = records
            .filter(element => {
                if (element.valid) return element
                return undefined
            })
            .map(element => element.product)

        writeTofile(newArray)
    }, [records])

    return (
        <main className={classes.layout}>
            <RecordGripperPannel
                setActiveRecord={setActiveRecord}
                activeRecord={activeRecord.values.record}

                records={records}
                setRecords={setRecords}
            />

            <ContentPanel
                activeRecord={activeRecord}
                setActiveRecord={setActiveRecord}

                records={records}
                setRecords={setRecords}
            />

        </main>

    );
};

export default MainPage;