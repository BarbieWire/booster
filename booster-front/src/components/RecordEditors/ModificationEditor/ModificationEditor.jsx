import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';

import classes from './ModificationEditor.module.css'
import fieldClasses from '../../../common/css/fields.module.css'

import { createModification } from './modifications';

import _ from 'lodash'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faTrashCan } from '@fortawesome/free-solid-svg-icons';



const ModificationEditor = ({ modificationList, setRecord }) => {
    const [modifications, setModifications] = useImmer(modificationList)

    const [modificationTitles, setModificationTitles] = useState(['S', 'M', 'L', "XL"]); // initial titles
    const [selectedTitle, setSelectedTitle] = useState("");

    useEffect(() => {
        setRecord(draft => {
            draft.product.colours.colour.modifications.modification = modifications
        })
    }, [modifications])

    // Filter untaken titles
    const untakenModificationTitles = modificationTitles.filter((title) => !modifications.some(obj => obj["modification-title"].__cdata === title));

    // Function to handle object creation
    const appendModification = () => {
        if (selectedTitle && !modifications.some(obj => obj["modification-title"].__cdata === selectedTitle)) {
            const newModification = createModification(selectedTitle)
            if (newModification) {
                setModifications(draft => {
                    draft.push(newModification)
                })
                setSelectedTitle('');
            }
        }
    };

    const deleteModification = (index) => {
        setModifications(draft => {
            draft.splice(index, 1)
        })
    };



    // Function to handle title selection
    const handleTitleSelect = (e) => {
        setSelectedTitle(e.target.value);
    };

    const processNumberInputs = (e) => {
        let number = parseFloat(e.target.value)
        number = isNaN(number) ? "" : number
        return number
    }

    const handleWeight = (e, index) => {
        setModifications((draft) => {
            draft[index].weight = processNumberInputs(e)
        });
    }

    const handleLength = (e, index) => {
        setModifications((draft) => {
            draft[index].length = processNumberInputs(e)
        });
    }

    const handleHeight = (e, index) => {
        setModifications((draft) => {
            draft[index].height = processNumberInputs(e)
        });
    }

    const handleWidth = (e, index) => {
        setModifications((draft) => {
            draft[index].width = processNumberInputs(e)
        });
    }

    const handleBarcode = (e, index) => {
        setModifications((draft) => {
            draft[index].attributes.barcodes.barcode.__cdata = e.target.value
        });
    }

    const handleSupplierCode = (e, index) => {
        setModifications((draft) => {
            draft[index].attributes["supplier-code"].__cdata = e.target.value
        });
    }

    return (
        <div>
            <div className={classes.upperContainer}>
                <h1 className={fieldClasses.title}>Product Modifications</h1>
                <div className={classes.createModification}>
                    <select value={selectedTitle} onChange={handleTitleSelect} className={classes.selectTitle}>
                        <option value="" disabled>Select a title</option>
                        {
                            untakenModificationTitles.map((title, index) => (
                                <option key={index} value={title}>
                                    {title}
                                </option>
                            ))
                        }
                    </select>
                    <button onClick={appendModification} className={classes.btn}><FontAwesomeIcon icon={faAdd}/></button>
                </div>
            </div>

            <div className={classes.modificationBlock}>
                {
                    modifications.map((modification, arrayIndex) => {
                        return (
                            <div className={classes.modificationContainer} key={modification["modification-title"]["__cdata"]}>
                                <h1 className={classes.modificationTitle}>Modification {modification["modification-title"]["__cdata"]}</h1>

                                <div className={fieldClasses.container}>
                                    <div className={fieldClasses.item}>
                                        <input
                                            min={0}
                                            type="number"
                                            value={modification.weight}
                                            onChange={(e) => handleWeight(e, arrayIndex)}
                                            id='weight'
                                            placeholder=" "
                                        />
                                        <label htmlFor="weight">weight: </label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            min={0}
                                            type="number"
                                            value={modification.length}
                                            onChange={(e) => handleLength(e, arrayIndex)}
                                            id='length'
                                            placeholder=" "
                                        />
                                        <label htmlFor="length">length: </label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            type="number"
                                            value={modification.height}
                                            onChange={(e) => handleHeight(e, arrayIndex)}
                                            id='height'
                                            placeholder=" "
                                        />
                                        <label htmlFor="height">height:</label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            type="number"
                                            value={modification.width}
                                            onChange={(e) => handleWidth(e, arrayIndex)}
                                            id='width'
                                            placeholder=" "
                                        />
                                        <label htmlFor="width">width: </label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            type="number"
                                            value={modification.attributes.barcodes.barcode.__cdata}
                                            onChange={(e) => handleBarcode(e, arrayIndex)}
                                            id='barcode'
                                            placeholder=" "
                                        />
                                        <label htmlFor="barcode">barcode: </label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            type="text"
                                            value={modification.attributes["supplier-code"].__cdata}
                                            onChange={(e) => handleSupplierCode(e, arrayIndex)}
                                            id='supplier-code'
                                            placeholder=" "
                                        />
                                        <label htmlFor="supplier-code">supplier code:</label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <button onClick={() => deleteModification(arrayIndex)}>
                                        <FontAwesomeIcon icon={faTrashCan}/>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ModificationEditor;