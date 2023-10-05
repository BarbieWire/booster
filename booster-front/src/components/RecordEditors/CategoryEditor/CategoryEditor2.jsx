import React from 'react';
import Select from 'react-select'


import options from "./Categories.json"


const CategoryEditor2 = ({ setRecord, record }) => {
    function extractDefaultCategory() {
        const value = record.product["category-id"]
        const label = record.product["category-name"]["__cdata"]
        if (label && value) {
            return {label: label, value: value}
        }
        return null
    }


    function handleChange(option) {
        setRecord(draft => {
            if (option) {
                draft.product["category-id"] = option.value
                draft.product["category-name"]["__cdata"] = option.label
            }
        })
    }

    return (
        <div>
            <Select
                options={options}
                isClearable
                isSearchable
                onChange={handleChange}
                defaultValue={extractDefaultCategory() || "Select"}
            />
        </div>
    );
};

export default CategoryEditor2;