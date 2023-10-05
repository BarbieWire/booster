import React, { useEffect } from 'react';
import { useImmer } from "use-immer";

import ModificationEditor from '../ModificationEditor/ModificationEditor';

import CategoryEditor from '../CategoryEditor/CategoryEditor';


import CategoryEditor2 from '../CategoryEditor/CategoryEditor2';


const RecordEditorWindow = ({ currentRecord }) => {
    const [record, setRecord] = useImmer(currentRecord)

    function updateRecord() {
        window.api.executeActionOnRecords("update", { index: record.id, record: record.product })
    }

    return (
        <div>
            {/* <CategoryEditor setRec={setRec} preselected={rec.product["category-id"]}/> */}


            <CategoryEditor2 setRecord={setRecord} record={record} />
            <ModificationEditor
                record={record}
                setRecord={setRecord}
                key={`modification_block`}
            />

            <button onClick={updateRecord}>update</button>

            <pre style={{ color: "white" }}>{JSON.stringify(record, null, 2)}</pre>
        </div>
    );
};

export default RecordEditorWindow;