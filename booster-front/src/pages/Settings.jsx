import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import classes from './css/settings.module.css'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import ConfigPair from '../components/configPair/ConfigPair';


const SettingsPage = props => {
    const [configJSON, setConfigJSON] = useState({})
    useEffect(() => {
        const fetch = async () => {
            const config = await window.api.retrieveConfigFileAsJson()
            setConfigJSON(config)
        }

        fetch()
    }, [setConfigJSON])

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
                {Object.entries(configJSON).map(pair => {
                    return <ConfigPair pair={pair}/>
                })}
            </section>
        </main>
    );
};

SettingsPage.propTypes = {

};

export default SettingsPage;    