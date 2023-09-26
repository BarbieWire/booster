import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classes from './ConfigPair.module.css';


const ConfigPair = ({ pair }) => {
    const [initialValue, setInitialValue] = useState(pair[1])
    const [value, setValue] = useState(pair[1]);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const saveProperty = async () => {
        const data = await window.api.changeConfigFile({key: pair[0], value: value})
        setInitialValue(data)
    }

    return (
        <div className={classes.record}>
            <div className={classes.name}>{pair[0]}: </div>
            <input type="text" value={value} onChange={handleChange} className={classes.optionField} />
            {
                `${value}` !== `${initialValue}`
                    ? <button className={classes.saveButton} onClick={saveProperty}>Save</button>
                    : null
            }
        </div>
    );
};

ConfigPair.propTypes = {

};

export default ConfigPair;