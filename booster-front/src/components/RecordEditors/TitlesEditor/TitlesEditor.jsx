import React, { useState } from 'react';

import classes from './TitlesEditor.module.css';

import fieldClasses from '../../../common/css/fields.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';

const TitlesEditor = ({ openai, record, setRecord }) => {
    const [generating, setGenerating] = useState(false)

    const functions = [
        {
            "name": "set_titles",
            "description": "Function set all the titles to react state.",
            "parameters": {
                "type": "object",
                "properties": {
                    russian_title: {
                        "type": "string",
                        "description": "Title translated into russian."
                    },
                    latvian_title: {
                        "type": "string",
                        "description": "Title translated into latvian."
                    },
                    estonian_title: {
                        "type": "string",
                        "description": "Title translated into Estonian."
                    },
                    lithuanian_title: {
                        "type": "string",
                        "description": "Title translated into Lithuanian."
                    },
                    finnish_title: {
                        "type": "string",
                        "description": "Title translated into Finnish."
                    }
                },
                require: ["latvian_title", "estonian_title", "russian_title", "lithuanian_title", "finnish_title"]
            }

        }
    ]

    async function generateData() {
        const title = record.product["title-ru"]["__cdata"]
        if (title) {
            try {
                setGenerating(true)
                const titles = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo-0613",
                    messages: [
                        {
                            "role": "system",
                            "content": "You are a helpful assistant"
                        },
                        {
                            "role": "user",
                            "content": `Perform the following actions on the given title delimited by triple quotation marks """${title}"""\n\nActions:\n1. translate given title word for word into: Estonian,\n2. translate given title word for word into: Latvian,\n3. translate given title word for word into: Lithuanian\n4. translate given title word for word into: Russian\n5.translate given title word for word into: Finnish\n\n`
                        }
                    ],
                    temperature: 0,
                    max_tokens: 1899,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    functions: functions,
                    function_call: {
                        name: "set_titles"
                    }
                });
                const newObject = JSON.parse(titles.choices[0].message.function_call.arguments)
                setRecord(draft => {
                    draft.product["title"]["__cdata"] = newObject["lithuanian_title"]
                    draft.product["title-ru"]["__cdata"] = newObject["russian_title"]
                    draft.product["title-lv"]["__cdata"] = newObject["latvian_title"]
                    draft.product["title-ee"]["__cdata"] = newObject["estonian_title"]
                    draft.product["title-fi"]["__cdata"] = newObject["finnish_title"]
                })
                setGenerating(false)
            } catch (e) {
                console.log(e)
                setGenerating(false)
            }
        }
    }

    return (
        <div>
            <div className={classes.header}>
                <h1 className={fieldClasses.title}>Titles</h1>
                {
                    generating && <span className={fieldClasses.loader}></span>
                }
            </div>

            <div className={fieldClasses.container}>
                <div className={fieldClasses.item}>
                    <button disabled={generating} onClick={generateData} className={classes.btn}><FontAwesomeIcon icon={faGears} /></button>
                </div>
                <div className={fieldClasses.item}>
                    <input
                        type="text"
                        id="lt"
                        placeholder=' '
                        value={record.product["title"]["__cdata"]}
                        onChange={(e) => setRecord((draft) => {
                            draft.product["title"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="lt">title-lt:</label>
                </div>
                <div className={fieldClasses.item}>
                    <input
                        type="text"
                        id="ru"
                        placeholder=' '
                        value={record.product["title-ru"]["__cdata"]}
                        onChange={(e) => setRecord((draft) => {
                            draft.product["title-ru"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="ru">title-ru:</label>
                </div>
                <div className={fieldClasses.item}>
                    <input
                        type="text"
                        id="lv"
                        placeholder=' '
                        value={record.product["title-lv"]["__cdata"]}
                        onChange={(e) => setRecord((draft) => {
                            draft.product["title-lv"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="lv">title-lv:</label>
                </div>
                <div className={fieldClasses.item}>
                    <input
                        type="text"
                        id="ee"
                        placeholder=' '
                        value={record.product["title-ee"]["__cdata"]}
                        onChange={(e) => setRecord((draft) => {
                            draft.product["title-ee"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="ee">title-ee:</label>
                </div>
                <div className={fieldClasses.item}>
                    <input
                        type="text"
                        id="fi"
                        placeholder=' '
                        value={record.product["title-fi"]["__cdata"]}
                        onChange={(e) => setRecord((draft) => {
                            draft.product["title-fi"]["__cdata"] = e.target.value
                        })}
                    />
                    <label htmlFor="fi">title-fi:</label>
                </div>
            </div>
        </div>
    );
};

export default TitlesEditor;