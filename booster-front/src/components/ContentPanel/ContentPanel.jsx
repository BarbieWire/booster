import React, { useContext } from 'react';
import UserMessagesContext from '../../context/UserMessagesContext';

import RecordEditorWindow from '../../components/RecordEditors/RecordEditorWindow/RecordEditorWindow';
import RecordFactory from '../../components/RecordFactory/RecordFactory';

import classes from './ContentPanel.module.css'

import { validateRecord } from '../../utils/validate/validate'



const ContentPanel = ({ setActiveRecord, activeRecord, records, setRecords }) => {
    const { createMessageHelper } = useContext(UserMessagesContext)

    function save(record) {
        // if valid returns true otherwise false 
        const isValid = validateRecord(record.product)
        record = isValid ? { ...record, valid: true } : { ...record, valid: false }

        isValid
            ? createMessageHelper("success", "Record is valid, saved to file", "validateRecord")
            : createMessageHelper("failure", "Some fields are missiing, saved as draft", "validateRecord")

        let newArray = [...records];
        newArray[record.id] = record;
        setRecords(newArray)
    }

    return (
        <section className={classes.contentPanel}>
            <div className={classes.contentMainSection}>

                {
                    activeRecord.values.record && <RecordEditorWindow
                        activeRecord={activeRecord}
                        saveCallback={save}
                    />
                }

                {
                    !activeRecord.values.record && <RecordFactory
                        records={records}
                        setRecords={setRecords}
                        setActiveRecord={setActiveRecord}
                    />
                }

            </div>
        </section>
    );
};

export default ContentPanel;