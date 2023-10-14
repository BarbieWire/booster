import React, { useState } from 'react';

import classes from './DescriptionEditor.module.css'

import fieldClasses from '../../../common/css/fields.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';

const DescriptionEditor = ({ record, openai, setRecord }) => {
    const [generating, setGenerating] = useState(false)
    const functions = [
        {
            "name": "set_descriptions",
            "description": "Function set all the descriptions to react state.",
            "parameters": {
                "type": "object",
                "properties": {
                    russian_description: {
                        "type": "string",
                        "description": "Description translated into russian."
                    },
                    latvian_description: {
                        "type": "string",
                        "description": "Description translated into latvian."
                    },
                    estonian_description: {
                        "type": "string",
                        "description": "Description translated into Estonian."
                    },
                    lithuanian_description: {
                        "type": "string",
                        "description": "Description translated into Lithuanian."
                    },
                    finnish_description: {
                        "type": "string",
                        "description": "Description translated into Finnish."
                    },
                },
            }
        }
    ]

    async function generateData() {
        const title = record.product["title-ru"]["__cdata"]
        if (title) {
            setGenerating(true)
            const descriptions = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-0613",
                messages: [
                    {
                        "role": "system",
                        "content": "You are a merchant that loves to describe their product using as much epithets as possible"
                    },
                    {
                        "role": "user",
                        "content": `Perform the following actions on the given title delimited by triple quotation marks """${title}"""\n\nActions:\n1. based on the given title you have to generate description describe them as much as possible, description consists of approximately 130 WORDS\n2. translate generated description into: Estonian\n3. translate generated description into: Latvian\n4. translate generated description into: Lithuanian\n5. translate generated description into: Russian\n6. translate generated description into: Finnish\n\n\n`
                    }
                ],
                temperature: 0.5,
                max_tokens: 3700,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                functions: functions,
                function_call: {
                    name: "set_descriptions"
                }
            });
            try {
                const newObject = JSON.parse(descriptions.choices[0].message.function_call.arguments)
                setRecord(draft => {
                    draft.product["long-description"]["__cdata"] = newObject["lithuanian_description"]
                    draft.product["long-description-ru"]["__cdata"] = newObject["russian_description"]
                    draft.product["long-description-lv"]["__cdata"] = newObject["latvian_description"]
                    draft.product["long-description-ee"]["__cdata"] = newObject["estonian_description"]
                    draft.product["long-description-fi"]["__cdata"] = newObject["finnish_description"]
                })
                setGenerating(false)
            } catch (err) {
                console.log("failed to parse json")
            }
        }
    }

    return (
        <div>
            <div className={classes.header}>
                <h1 className={fieldClasses.title}>Descriptions</h1>
                {
                    generating && <span class={fieldClasses.loader}></span>
                }
            </div>

            <div>
                <button onClick={generateData} disabled={generating} className={classes.btn}>
                <FontAwesomeIcon icon={faGears}/>
                </button>
            </div>

            <div className={fieldClasses.container}>
                <div className={fieldClasses.item}>
                    <textarea
                        spellCheck="false"
                        type="text"
                        id="lt-desc"
                        placeholder=' '
                        value={record.product["long-description"]["__cdata"]}
                        onChange={e => setRecord(draft => {
                            draft.product["long-description"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="lt-desc">long-description-lt:</label>
                </div>
                <div className={fieldClasses.item}>
                    <textarea
                        spellCheck="false"
                        type="text"
                        id="ru-desc"
                        placeholder=' '
                        value={record.product["long-description-ru"]["__cdata"]}
                        onChange={e => setRecord(draft => {
                            draft.product["long-description-ru"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="ru-desc">long-description-ru:</label>
                </div>
                <div className={fieldClasses.item}>
                    <textarea
                        spellCheck="false"
                        type="text"
                        id="lv-desc"
                        placeholder=' '
                        value={record.product["long-description-lv"]["__cdata"]}
                        onChange={e => setRecord(draft => {
                            draft.product["long-description-lv"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="lv-desc">long-description-lv:</label>
                </div>
                <div className={fieldClasses.item}>
                    <textarea
                        spellCheck="false"
                        type="text"
                        id="ee-desc"
                        placeholder=' '
                        value={record.product["long-description-ee"]["__cdata"]}
                        onChange={e => setRecord(draft => {
                            draft.product["long-description-ee"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="ee-desc">long-description-ee:</label>
                </div>
                <div className={fieldClasses.item}>
                    <textarea
                        spellCheck="false"
                        type="text"
                        id="fi-desc"
                        placeholder=' '
                        value={record.product["long-description-fi"]["__cdata"]}
                        onChange={e => setRecord(draft => {
                            draft.product["long-description-fi"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="fi-desc">long-description-fi:</label>
                </div>
            </div>
        </div>
    );
};

export default DescriptionEditor;