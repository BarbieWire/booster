import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import classes from './css/selectFile.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { NavLink } from 'react-router-dom';

const SelectFilePage = props => {
    const [currentPath, setCurrentPath] = useState()

    async function retrieveCurrentPath() {
        const path = await window.api.retrieveCurrentFilePath()
        setCurrentPath(path)
    }

    useEffect(() => {
        retrieveCurrentPath()

        window.api.receiveCurrentPathFromMain((event, result) => {
            setCurrentPath(result)
        })
    }, [])

    async function createXMLFile() {
        window.api.createNewXMLDocument()
    }

    async function openExistingFile() {
        window.api.openExistingXMLDocument()
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
                <span className={classes.path}>
                    current file location: <span>{currentPath}</span>
                </span>
                <div className={classes.btnContainer}>
                    <button onClick={createXMLFile} className={classes.btn}>Create new file</button>
                    <button onClick={openExistingFile} className={classes.btn}>Open</button>
                </div>
            </section>
        </main>
    );
};

SelectFilePage.propTypes = {

};

export default SelectFilePage;