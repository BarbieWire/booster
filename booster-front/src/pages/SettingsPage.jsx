import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ConfigContext from '../context/ConfigContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classes from './css/Settings.module.css';

import debounce from 'lodash/debounce';


export const SettingsPage = () => {
    const { userConfig, setUserConfig } = useContext(ConfigContext);
    const [changedFields, setChangedFields] = useState([]);

    const handleInputChange = (e, id) => {
        const { value } = e.target;
        setUserConfig(prevFormData => prevFormData.map(field => {
            if (field.id === id && field.value !== value) {
                const changedElemIndex = changedFields.findIndex(obj => obj.id === id)

                if (changedElemIndex > -1) {
                    setChangedFields(prevChangedFields => {
                        const newarr = [...prevChangedFields]
                        newarr[changedElemIndex].newValue = value
                        return newarr
                    });
                }
                else {
                    const fieldToChange = {id: field.id, newValue: value}
                    setChangedFields(prevChangedFields => [...prevChangedFields, fieldToChange]);
                }
                return { ...field, value };
            }
            return field;
        }));
    };

    useEffect(() => {
        const saveConfig = () => {
            try {
                window.api.updateRecords('sensitive', changedFields)
                setChangedFields([])
            } catch (error) {
                console.error('Error saving data:', error);
            }
        };

        // Debounce the saveDataToServer function with a delay of 1500ms
        const debouncedSaveConfig = debounce(saveConfig, 1000);
        // Call the debounced function whenever formData changes
        if (changedFields.length > 0) debouncedSaveConfig();
     
        // Clean up the debounced function when the component unmounts
        return () => {
            debouncedSaveConfig.cancel();
        };
    }, [changedFields]);



    return (
        <main className={classes.layout}>
            <section className={classes.menu}>
                <NavLink to='/' className={classes.setting}>
                    <FontAwesomeIcon icon={faArrowLeft} className={`fontawesome-icon ${classes.menuIcon}`} />
                </NavLink>
            </section>
            <section className={classes.mainContent}>
                {userConfig.map((obj) => {
                    return <div className={classes.record} key={`settings_${obj.name}_${obj.id}`}>
                        <div className={classes.name}>{obj.name}: </div>
                        <input
                            type="text"
                            value={obj.value}
                            className={classes.optionField}
                            onChange={(e) => handleInputChange(e, obj.id)} />
                    </div>;
                })}

            </section>
        </main>
    );
};
