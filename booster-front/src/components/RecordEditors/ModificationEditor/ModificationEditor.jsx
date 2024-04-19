import React, { useState } from 'react';

import classes from './ModificationEditor.module.css'
import fieldClasses from '../../../common/css/fields.module.css'

import { createModification } from './modifications';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faTrashCan } from '@fortawesome/free-solid-svg-icons';



const ModificationEditor = ({ modifications, setModifications }) => {
    const [modificationTitles] = useState(["XS", "S", "M", "L", "XL", "2XL", "3XL"]); // initial titles
    const [selectedTitle, setSelectedTitle] = useState("");

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
        <div className='editorSectionContainer'>
            <h1>Edit Modifications</h1>

            <div className={classes.createModificationPane}>
                <select
                    value={selectedTitle}
                    onChange={handleTitleSelect}
                    className={classes.selectTitle}
                >
                    <option value="" disabled>Select a title</option>
                    {
                        untakenModificationTitles.map((title, index) => (
                            <option key={index} value={title}>
                                {title}
                            </option>
                        ))
                    }
                </select>
                <button onClick={appendModification} className={classes.btn}><FontAwesomeIcon icon={faAdd} /></button>
            </div>

            <div className={classes.modificationBlock}>
                {
                    modifications.map((modification, arrayIndex) => {
                        return (
                            <div className={classes.modificationContainer} key={modification["modification-title"]["__cdata"]}>
                                <h4>Modification {modification["modification-title"]["__cdata"]}</h4>

                                <div className={fieldClasses.container}>
                                    <div className={fieldClasses.item}>
                                        <input
                                            min={0}
                                            type="number"
                                            value={modification.weight}
                                            onChange={(e) => handleWeight(e, arrayIndex)}
                                            id={`weight_${modification["modification-title"]["__cdata"]}`}
                                            placeholder=" "
                                        />
                                        <label htmlFor={`weight_${modification["modification-title"]["__cdata"]}`}>weight: </label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            min={0}
                                            type="number"
                                            value={modification.length}
                                            onChange={(e) => handleLength(e, arrayIndex)}
                                            id={`length_${modification["modification-title"]["__cdata"]}`}
                                            placeholder=" "
                                        />
                                        <label htmlFor={`length_${modification["modification-title"]["__cdata"]}`}>length: </label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            type="number"
                                            value={modification.height}
                                            onChange={(e) => handleHeight(e, arrayIndex)}
                                            id={`height_${modification["modification-title"]["__cdata"]}`}
                                            placeholder=" "
                                        />
                                        <label htmlFor={`height_${modification["modification-title"]["__cdata"]}`}>height:</label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            type="number"
                                            value={modification.width}
                                            onChange={(e) => handleWidth(e, arrayIndex)}
                                            id={`width_${modification["modification-title"]["__cdata"]}`}
                                            placeholder=" "
                                        />
                                        <label htmlFor={`width_${modification["modification-title"]["__cdata"]}`}>width: </label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            type="number"
                                            value={modification.attributes.barcodes.barcode.__cdata}
                                            onChange={(e) => handleBarcode(e, arrayIndex)}
                                            id={`barcode_${modification["modification-title"]["__cdata"]}`}
                                            placeholder=" "
                                        />
                                        <label htmlFor={`barcode_${modification["modification-title"]["__cdata"]}`}>barcode: </label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <input
                                            type="text"
                                            value={modification.attributes["supplier-code"].__cdata}
                                            onChange={(e) => handleSupplierCode(e, arrayIndex)}
                                            id={`supplier-code_${modification["modification-title"]["__cdata"]}`}
                                            placeholder=" "
                                        />
                                        <label htmlFor={`supplier-code_${modification["modification-title"]["__cdata"]}`}>supplier code:</label>
                                    </div>

                                    <div className={fieldClasses.item}>
                                        <button onClick={() => deleteModification(arrayIndex)}>
                                            <FontAwesomeIcon icon={faTrashCan} />
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