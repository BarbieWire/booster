import React, { useState, useEffect } from 'react';

import { Outlet } from 'react-router-dom';

import { ConfigProvider } from '../context/ConfigContext'
import { PathProvider } from '../context/PathContext';
import { UserMessagesProvider } from '../context/UserMessagesContext';


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


    const [userMessages, setUserMessages] = useState([])
    useEffect(() => {
        const listener = (event, result) => {
            console.log(result)
            setUserMessages(messages => {
                return [result, ...messages]
            })
        }
        window.api.displayMessageFromServer(listener)
        return () => {
            window.api.removeEventListener('display-server-message', listener);
        }
    }, [])


    function remove(index) {
        setUserMessages(messages => {
            const newMessages = [...messages]
            newMessages.splice(index, 1)
            return newMessages
        })
    }

    function createMessageHelper(status, message, sender) {
        const newMessage = {
            status: status,
            content: { "message": message },
            sender: sender,
        }
        setUserMessages([...userMessages, newMessage])
    }

    return (
        <ConfigProvider value={{ configJSON, setConfigJSON }}>
            <PathProvider value={{ filePath, setFilePath }}>
                <UserMessagesProvider value={{ createMessageHelper }}>
                    <div className={classes.messageContainer}>
                        {
                            userMessages.map((message, index) => {
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
                </UserMessagesProvider>
            </PathProvider>
        </ConfigProvider>
    );
};

export default ContextLayout;
