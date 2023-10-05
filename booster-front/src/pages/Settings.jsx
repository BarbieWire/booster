import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import classes from './css/settings.module.css'

import ConfigProperty from '../components/ConfigProperty/ConfigProperty'

import ConfigContext from '../context/ConfigContext';


const SettingsPage = () => {
    const { configJSON, setConfigJSON } = useContext(ConfigContext)

    function handleChange(name, value) {
        const config = { ...configJSON }
        config[name] = value
        setConfigJSON(config)
    }

    return (
        <main className={classes.layout}>
            <section className={classes.menu}>
                <NavLink to='/'>
                    <div className={classes.setting}>
                        <FontAwesomeIcon icon={faArrowLeft} className={`fontawesome-icon ${classes.menuIcon}`} />
                    </div>
                </NavLink>
            </section>
            <section className={classes.mainContent}>
                {
                    Object.entries(configJSON).map((pair, index) => {
                        return <ConfigProperty
                            name={pair[0]}
                            value={pair[1]}
                            handleChange={handleChange}
                            key={`config_${index}`}
                        />
                    })
                }
            </section>
        </main>
    );
};

export default SettingsPage;    