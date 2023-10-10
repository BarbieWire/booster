import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classes from './ConfigProperty.module.css';


const ConfigProperty = ({ name, value, handleChange }) => {

    return (
        <div className={classes.record}>
            <div className={classes.name}>{name}: </div>
            <input type="text" value={value} className={classes.optionField} onChange={(e) => handleChange(name, e.target.value)}/>
        </div>
    );
};

ConfigProperty.propTypes = {

};

export default ConfigProperty;