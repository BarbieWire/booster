import React, { useState, useContext } from 'react';
import UserMessagesContext from '../../../context/UserMessagesContext';


import classes from './TitlesEditor.module.css';
import fieldClasses from '../../../common/css/fields.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';

import { translateTitles } from '../../../api/openAICompletions';


const TitlesEditor = ({ openai, record, setRecord }) => {
    const [generating, setGenerating] = useState(false)
    const { createMessageHelper } = useContext(UserMessagesContext)

    const availableLanguagesSuffixes = [
        "-ru", "", "-lv", "-ee", "-fi"
    ]

    async function translateTitle() {
        const title = record.product["title-ru"]["__cdata"]
        if (!title) {
            createMessageHelper("failure", "In order to prepare translations please provide \"title-ru\" first", "translateTitle")
            return
        }
        setGenerating(true)

        try {
            const titleJSON = await translateTitles(title, openai)

            if (Object.keys(titleJSON).length >= availableLanguagesSuffixes.length) {
                setRecord(draft => {
                    draft.product["title"]["__cdata"] = titleJSON["lithuanian_title"]
                    draft.product["title-ru"]["__cdata"] = titleJSON["russian_title"]
                    draft.product["title-lv"]["__cdata"] = titleJSON["latvian_title"]
                    draft.product["title-ee"]["__cdata"] = titleJSON["estonian_title"]
                    draft.product["title-fi"]["__cdata"] = titleJSON["finnish_title"]
                })
                createMessageHelper("success", "Successfully translated title", "translateTitle")
            } else {
                createMessageHelper("failure", "Something went wrong parsing response, try rewriting your \"title-ru\" ", "translateTitle")
            }
        } catch (error) {
            createMessageHelper("failure", "Error occured, please try again.", "translateTitle")
        }

        setGenerating(false)
    }

    return (
        <div className='editorSectionContainer'>
            <div className={classes.header}>
                <h1>Titles</h1>
                {
                    generating && <span className={fieldClasses.loader}></span>
                }
            </div>
            <p>
                To prepare translations make sure field "title-ru" is not empty (Initial filling of the field can be provided in any language) <br />
                Try to provide "title-ru" in English in order to obtain more accurate results.
            </p>

            <div className={fieldClasses.container}>
                <div className={fieldClasses.item}>
                    <button disabled={generating} onClick={translateTitle}>
                        <FontAwesomeIcon icon={faLanguage} />
                        <span>{generating ? "In Progress" : "Prepare Translations"}</span>
                    </button>
                </div>
                {
                    availableLanguagesSuffixes.map((suffix, index) => {
                        return <div className={fieldClasses.item} key={`title${suffix}-${index}`}>
                            <input
                                type="text"
                                id={`title${suffix}`}
                                placeholder=' '
                                value={record.product[`title${suffix}`]["__cdata"]}
                                onChange={(e) => setRecord((draft) => {
                                    draft.product[`title${suffix}`]["__cdata"] = e.target.value
                                })}
                            />
                            <label htmlFor={`title${suffix}`}>{`title${suffix || "-lt"}`}</label>
                        </div>
                    })
                }
            </div>
        </div>
    );
};

export default TitlesEditor;