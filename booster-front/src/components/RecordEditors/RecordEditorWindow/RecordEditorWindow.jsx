import React, { useContext } from 'react';
import { useImmer } from "use-immer";

import ConfigContext from '../../../context/ConfigContext';


// field editors
import ModificationEditor from '../ModificationEditor/ModificationEditor';
import CategoryEditor from '../CategoryEditor/CategoryEditor';
import TitlesEditor from '../TitlesEditor/TitlesEditor';
import DescriptionEditor from '../DescriptionEditor/DescriptionEditor';
import ImagesEditor from '../ImagesEditor/ImagesEditor';

import classes from './RecordEditorWindow.module.css'

import OpenAI from "openai";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';


const RecordEditorWindow = ({ currentRecord, saveCallback }) => {
    const [record, setRecord] = useImmer(currentRecord)

    const { configJSON } = useContext(ConfigContext)
    const openai = new OpenAI({
        apiKey: configJSON["chatGPTApiKey"],
        dangerouslyAllowBrowser: true
    })

    return (
        <div className={classes.container}>
            <CategoryEditor setRecord={setRecord} record={record} />

            {
                configJSON["chatGPTApiKey"]
                    ? <TitlesEditor openai={openai} record={record} setRecord={setRecord} />
                    : null
            }

            {
                configJSON["chatGPTApiKey"]
                    ? <DescriptionEditor openai={openai} record={record} setRecord={setRecord} />
                    : null
            }

            {
                configJSON["GoogleCX"] && configJSON["GoogleApiKey"]
                    ? <ImagesEditor setRecord={setRecord} currentImages={currentRecord.product.colours.colour.images.image.url} />
                    : null
            }

            <ModificationEditor
                modificationList={currentRecord.product.colours.colour.modifications.modification}
                setRecord={setRecord}
                key={`modification_block`}
            />
            <button onClick={() => saveCallback(record)} className={classes.saveButton}>
                <FontAwesomeIcon icon={faFloppyDisk} />
            </button>
        </div>
    );
};

export default RecordEditorWindow;