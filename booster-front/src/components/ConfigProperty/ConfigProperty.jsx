import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classes from './ConfigProperty.module.css';


const ConfigProperty = ({ name, value, handleChange }) => {
    const saveProperty = async () => {
        const data = await window.api.changeConfigFile({key: name, value: value})
    }

    return (
        <div className={classes.record}>
            <div className={classes.name}>{name}: </div>
            <input type="text" value={value} className={classes.optionField} onChange={(e) => handleChange(name, e.target.value)}/>
            <button className={classes.saveButton} onClick={saveProperty}>Save</button>
        </div>
    );
};

ConfigProperty.propTypes = {

};

export default ConfigProperty;