import React, { useContext } from 'react';

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


const RecordEditorWindow = ({ activeRecord, saveCallback }) => {
    const { configJSON } = useContext(ConfigContext)
    const openai = new OpenAI({
        apiKey: configJSON["chatGPTApiKey"],
        dangerouslyAllowBrowser: true
    })

    const { values, actions } = activeRecord

    return (
        <>
            <CategoryEditor
                record={values.record}
                setRecord={actions.setRecord}
            />
            {
                configJSON["chatGPTApiKey"] && <TitlesEditor
                    openai={openai}
                    record={values.record}
                    setRecord={actions.setRecord}
                />

            }
            {
                configJSON["chatGPTApiKey"] && <DescriptionEditor
                    openai={openai}
                    record={values.record}
                    setRecord={actions.setRecord}
                />
            }

            {
                (configJSON["GoogleCX"] && configJSON["GoogleApiKey"]) && <ImagesEditor
                    images={values.images}
                    setImages={actions.setImages}
                />
            }

            <ModificationEditor modifications={values.modifications} setModifications={actions.setModifications} />
            <button onClick={() => saveCallback(values.record)} className={classes.saveButton}>
                <FontAwesomeIcon icon={faFloppyDisk} />
            </button>
        </>
    );
};

export default RecordEditorWindow;