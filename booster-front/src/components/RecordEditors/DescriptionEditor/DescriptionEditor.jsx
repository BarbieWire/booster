import React, { useState, useContext } from 'react';
import UserMessagesContext from '../../../context/UserMessagesContext';

import { generateDescriptionStream, translateDescriptionToSpecificLanguage } from '../../../api/openAICompletions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears, faLanguage, faChevronLeft, faChevronRight, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';


import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';


import classes from './DescriptionEditor.module.css'

import fieldClasses from '../../../common/css/fields.module.css'

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './Swiper.css';


const DescriptionEditor = ({ record, openai, setRecord }) => {
    const [translating, setTranslating] = useState(false)
    const [generating, setGenerating] = useState(false)

    const [generatedDescription, setGeneratedDescription] = useState("")
    const [desiredDescriptionLanguage, setDesiredDescriptionLanguage] = useState("English");

    const { createMessageHelper } = useContext(UserMessagesContext)

    const handleLanguageChange = (event) => {
        if (generatedDescription.length) setGeneratedDescription("")
        setDesiredDescriptionLanguage(event.target.value);
    };

    async function generateDescription() {
        if (!record.product["title-ru"]["__cdata"]) {
            createMessageHelper("failure", "Please provide \"title-ru\" first", "generateDescription")
            return
        }
        if (generatedDescription.length) setGeneratedDescription("")

        setGenerating(true)
        try {
            const title = record.product["title-ru"]["__cdata"]
            await generateDescriptionStream(desiredDescriptionLanguage, title, setGeneratedDescription, openai)
            createMessageHelper("success", "Successfully generated description in " + desiredDescriptionLanguage, "generateDescription")
        } catch {
            createMessageHelper("failure", "Something went wrong generating description, please try again", "generateDescription")
        }
        setGenerating(false)
    }

    // shortcut to reduce code -> see example lower
    const availableLanguageSuffixes = [
        "-ru", "", "-lv", "-ee", "-fi"
    ]

    const availableLanguages = [
        "Russian", "Lithuanian", "Latvian", "Estonian", "Finnish"
    ]

    const languageMap = availableLanguages.reduce((accumulator, key, index) => {
        return { ...accumulator, [key]: availableLanguageSuffixes[index] };
    }, {});

    availableLanguages.unshift("English")

    function translateDescription() {
        if (!generatedDescription.length) {
            createMessageHelper("failure", `Please generate or provide <b>long-description</b> first`, "translateDescription")
            return
        }
        setTranslating(true)
        const promisePool = []
        for (const [language, suffix] of Object.entries(languageMap)) {
            if (language === desiredDescriptionLanguage) {
                setRecord(draft => {
                    draft.product[`long-description${suffix}`]["__cdata"] = generatedDescription
                })
                createMessageHelper("success", `Description in <b>${language}</b> successfully set`, "translateDescription")
                continue
            }
            const newPromisedTranslation = translateDescriptionToSpecificLanguage(language, generatedDescription, openai)
            newPromisedTranslation
                .then(result => {
                    setRecord(draft => {
                        draft.product[`long-description${suffix}`]["__cdata"] = result
                    })
                    createMessageHelper("success", `Description successfully translated into <b>${language}</b>`, "translateDescriptionToSpecificLanguage")
                })
                .catch((e) => {
                    createMessageHelper("failure", `Failed to translate into <b>${language}</b>, ${e.error.message}`, "translateDescriptionToSpecificLanguage")
                })
            promisePool.push(newPromisedTranslation)
        }

        Promise.allSettled(promisePool).then(() => {
            setTranslating(false)
        });
    }

    // horizontal controls
    const navigationHorizontalPrevRef = React.useRef(null)
    const navigationHorizontalNextRef = React.useRef(null)

    // vertical controls
    const navigationVerticalPrevRef = React.useRef(null)
    const navigationVerticalNextRef = React.useRef(null)

    return (
        <div className="editorSectionContainer">
            <div className={classes.header}>
                <h1>Descriptions</h1>
                {
                    translating && <span className={fieldClasses.loader}></span>
                }
            </div>
            <p>
                1. Description will be generated based to title-ru field above (field can't be empty) <br />
                2. "Generated long-descritption" won't be saved to final version of xml, it serves to generate description which could be translated into several languages
                (click right chevron to see your translations)
            </p>

            <div className={classes.buttonContainer}>
                <button
                    ref={navigationHorizontalPrevRef}
                    className={`${classes.button} ${classes.carouselControlButton}`}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                    ref={navigationHorizontalNextRef}
                    className={`${classes.button} ${classes.carouselControlButton}`}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>

                <button className={classes.button} onClick={translateDescription} disabled={generating || translating}>
                    <FontAwesomeIcon icon={faLanguage} />
                    <span>{translating ? "In Progress" : "Prepare Translations"}</span>
                </button>
            </div>

            <Swiper
                cssMode={true}
                spaceBetween={50}
                modules={[Navigation]}
                navigation={{
                    prevEl: navigationHorizontalPrevRef.current,
                    nextEl: navigationHorizontalNextRef.current,
                }}
            >
                <SwiperSlide>
                    <div className={classes.buttonContainer}>
                        <button
                            onClick={generateDescription}
                            disabled={generating}
                            className={`${classes.button} ${classes.generationButtons}`}
                        >
                            <FontAwesomeIcon icon={faGears} />
                            <span>{generating ? "Generation In Progress" : "Generate Description"}</span>
                        </button>

                        <select value={desiredDescriptionLanguage} onChange={handleLanguageChange} disabled={generating}>
                            {
                                availableLanguages.map((language, index) => {
                                    return <option value={language} key={`al_${language}_${index}`}>{language.charAt(0).toUpperCase() + language.slice(1)}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className={fieldClasses.item}>
                        <textarea
                            spellCheck="false"
                            type="text"
                            id="generated-desc"
                            placeholder=' '
                            value={generatedDescription}
                            onChange={e => setGeneratedDescription(e.target.value)}
                        />
                        <label htmlFor="generated-desc">Generated long-description</label>
                    </div>
                </SwiperSlide>
                <SwiperSlide className={"nestedCarouselSlide"}>
                    <Swiper
                        direction={'vertical'}
                        spaceBetween={10}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Navigation]}
                        navigation={{
                            prevEl: navigationVerticalPrevRef.current,
                            nextEl: navigationVerticalNextRef.current,
                        }}
                    >
                        {
                            availableLanguageSuffixes.map((suffix, index) => {
                                return <SwiperSlide key={suffix + index}>
                                    <div className={fieldClasses.item}>
                                        <textarea
                                            spellCheck="false"
                                            type="text"
                                            id={`desc${suffix}`}
                                            placeholder=' '
                                            value={record.product[`long-description${suffix}`]["__cdata"]}
                                            onChange={e => setRecord(draft => {
                                                draft.product[`long-description${suffix}`]["__cdata"] = e.target.value
                                            })}
                                        />
                                        <label htmlFor={`desc${suffix}`}>{`long-description${suffix || "-lt"}`}</label>
                                    </div>
                                </SwiperSlide>
                            })
                        }
                    </Swiper>
                    <div className={classes.innerCarouselButtonContainer}>
                        <button
                            className={classes.carouselControlButton}
                            ref={navigationVerticalPrevRef}
                        >
                            <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                        <button
                            className={classes.carouselControlButton}
                            ref={navigationVerticalNextRef}
                        >
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default DescriptionEditor;