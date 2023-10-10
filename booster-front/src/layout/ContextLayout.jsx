import React, { useState, useEffect } from 'react';

import { Outlet } from 'react-router-dom';

import { ConfigProvider } from '../context/ConfigContext'
import { PathProvider } from '../context/PathContext';


import classes from './ContexLayout.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';



const ContextLayout = () => {
    const [configJSON, setConfigJSON] = useState({})
    useEffect(() => {
        const fetch = async () => {
            const config = await window.api.retrieveConfigFileAsJson()
            setConfigJSON(config)
        }
        fetch()
    }, [])

    const [filePath, setFilePath] = useState("")
    useEffect(() => {
        async function retrieveCurrentPath() {
            const path = await window.api.retrieveCurrentFilePath()
            setFilePath(path)
        }

        retrieveCurrentPath()

        const listener = (event, result) => {
            setFilePath(result)
        }
        window.api.receiveCurrentPathFromMain(listener)
        return () => {
            window.api.removeEventListener('return-path', listener);
        }
    }, [])


    const [serverMessages, setServerMessages] = useState([])
    useEffect(() => {
        const listener = (event, result) => {
            setServerMessages(messages => {
                return [...messages, result]
            })
        }
        window.api.displayMessageFromServer(listener)
        return () => {
            window.api.removeEventListener('display-server-message', listener);
        }
    }, [])


    function remove(index) {
        setServerMessages(messages => {
            const newMessages = [...messages]
            newMessages.splice(index, 1)
            return newMessages
        })
    }

    return (
        <ConfigProvider value={{ configJSON, setConfigJSON }}>
            <PathProvider value={{ filePath, setFilePath }}>
                <div className={classes.messageContainer}>
                    {
                        serverMessages.map((message, index) => {
                            return <div className={classes.messageBox} key={`message_${index}`}>
                                <span className={classes.message}>{message.content.message}</span>
                                <button onClick={() => remove(index)} className={classes.btn}>
                                    <FontAwesomeIcon icon={faXmark} className={classes.close} />
                                </button>
                            </div>
                        })
                    }
                </div>
                <Outlet />
            </PathProvider>
        </ConfigProvider>
    );
};

export default ContextLayout;
