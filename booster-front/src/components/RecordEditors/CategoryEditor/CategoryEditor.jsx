import React from 'react';
import Select from 'react-select'

import options from "./Categories.json"

import classes from './CategoryEditor.module.css'


const CategoryEditor = ({ record, setRecord }) => {
    function handleChange(option) {
        setRecord(draft => {
            if (option) {
                draft.product["category-id"] = option.value
                draft.product["category-name"]["__cdata"] = option.label
            }
        })
    }

    const value = {
        label: record.product["category-name"]["__cdata"],
        value: record.product["category-id"]
    }


    return (
        <div>
            <div className={classes.header}>
                <h1 className={classes.title}>Categories</h1>
            </div>

            <Select
                options={options}
                isClearable
                isSearchable
                onChange={handleChange}
                value={value}
            />

        </div>
    );
};

export default CategoryEditor;