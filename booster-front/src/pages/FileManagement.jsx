import React, { useContext } from 'react';

import classes from './css/selectFile.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { NavLink } from 'react-router-dom';

import PathContext from '../context/PathContext';


const FileManagementPage = ({ }) => {
    const {filePath} = useContext(PathContext)

    async function mergeTwofiles() {
        if (filePath) {
            await window.api.mergeRecords()
        }
    }

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
                    current file location: <span>{filePath}</span>
                </span>
                <div className={classes.btnContainer}>
                    <button onClick={createXMLFile} className={classes.btn}>Create new file</button>
                    <button onClick={openExistingFile} className={classes.btn}>Open</button>
                    <button onClick={mergeTwofiles} className={classes.btn}>Merge</button>
                </div>
            </section>
        </main>
    );
};

export default FileManagementPage;