import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';

import classes from './ModificationEditor.module.css'


const ModificationEditor = ({ record, setRecord }) => {
    function getModificationArray() {
        const modifications = record.product.colours.colour.modifications.modification
        return modifications[0] === "" || modifications.length == 0 ? [] : modifications
    }

    const [modifications, setModifications] = useImmer(getModificationArray())
    const [modificationTitles, setModificationTitles] = useState(['S', 'M', 'L', "XL"]); // Example initial titles
    const [selectedTitle, setSelectedTitle] = useState("S");

    useEffect(() => {
        setRecord(draft => {
            draft.product.colours.colour.modifications.modification = modifications
        })
    }, [modifications])

    // Filter untaken titles
    const untakenModificationTitles = modificationTitles.filter((title) => !modifications.some(obj => obj["modification-title"].__cdata === title));

    const generateSupplierCode = () => {
        let code = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 1; i <= 12; i++) {
            let char = Math.floor(Math.random() * str.length + 1);
            code += str.charAt(char)
        }
        return code;
    }

    // Function to handle object creation
    const createModificationObject = () => {
        if (selectedTitle && !modifications.some(obj => obj["modification-title"].__cdata === selectedTitle)) {
            const newObject = {
                "modification-title": {
                    "__cdata": selectedTitle
                },
                "weight": 1.2,
                "length": 0.2,
                "height": 0.1,
                "width": 1.2,
                "attributes": {
                    "barcodes": {
                        "barcode": {
                            "__cdata": ""
                        }
                    },
                    "supplier-code": {
                        "__cdata": generateSupplierCode()
                    }
                }
            }
            setModifications(draft => {
                draft.push(newObject)
            })
            setSelectedTitle('');
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
            <div>
                <h1 className={classes.sectionTitle}>Product Modifications</h1>
                <div className={classes.createNewModificationContainer}>
                    <label>Select a title:</label>
                    <select value={selectedTitle} onChange={handleTitleSelect} className={classes.selectTitle}>
                        <option value="" disabled>
                            Select a title
                        </option>
                        {untakenModificationTitles.map((title, index) => (
                            <option key={index} value={title}>
                                {title}
                            </option>
                        ))}
                    </select>
                    <button onClick={createModificationObject} className={classes.btn}>Create New Modification</button>
                </div>
            </div>

            <div className={classes.modificationBlock}>
                {
                    modifications.map((modification, arrayIndex) => {
                        return (
                            <div className={classes.modificationContainer}>
                                <h1 className={classes.modificationTitle}>Modification {modification["modification-title"].__cdata}</h1>

                                <div className={classes.fieldsHolder}>
                                    <div className={classes.fieldHolder}>
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

                                    <div className={classes.fieldHolder}>
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

                                    <div className={classes.fieldHolder}>
                                        <input
                                            type="number"
                                            value={modification.height}
                                            onChange={(e) => handleHeight(e, arrayIndex)}
                                            id='height'
                                            placeholder=" "
                                        />
                                        <label htmlFor="height">height:</label>
                                    </div>

                                    <div className={classes.fieldHolder}>
                                        <input
                                            type="number"
                                            value={modification.width}
                                            onChange={(e) => handleWidth(e, arrayIndex)}
                                            id='width'
                                            placeholder=" "
                                        />
                                        <label htmlFor="width">width: </label>
                                    </div>

                                    <div className={classes.fieldHolder}>
                                        <input
                                            type="number"
                                            value={modification.attributes.barcodes.barcode.__cdata}
                                            onChange={(e) => handleBarcode(e, arrayIndex)}
                                            id='barcode'
                                            placeholder=" "
                                        />
                                        <label htmlFor="barcode">barcode: </label>
                                    </div>

                                    <div className={classes.fieldHolder}>
                                        <input
                                            type="text"
                                            value={modification.attributes["supplier-code"].__cdata}
                                            onChange={(e) => handleSupplierCode(e, arrayIndex)}
                                            id='supplier-code'
                                            placeholder=" "
                                        />
                                        <label htmlFor="supplier-code">supplier code:</label>
                                    </div>
                                    {
                                        modifications.length > 1
                                            ?
                                            <button onClick={() => deleteModification(arrayIndex)} className={`${classes.btn} ${classes.deleteBtn}`}>
                                                Delete {modification["modification-title"].__cdata}
                                            </button>
                                            :
                                            null
                                    }
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