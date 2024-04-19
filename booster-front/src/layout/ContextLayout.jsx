import React, { useState, useEffect } from 'react';

import { Outlet } from 'react-router-dom';

import { ConfigProvider } from '../context/ConfigContext'
import { PathProvider } from '../context/PathContext';
import { UserMessagesProvider } from '../context/UserMessagesContext';


import classes from './ContexLayout.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';



const ContextLayout = () => {
    const [userMessages, setUserMessages] = useState([])

    const [userConfig, setUserConfig] = useState([])
    const [filePath, setFilePath] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const resp = await window.api.getAllTableRecords('sensitive')
            if (resp) setUserConfig(resp)
        }
        fetchUserData()

        const fetchGears = async () => {
            const resp = await window.api.getAllTableRecords('gears')
            if (resp.length) setFilePath(resp[0].value)
        }
        fetchGears()
    }, [])

    useEffect(() => {
        const listener = (event, result) => {
            setFilePath(result)
        }
        window.api.currentFilePathResponse(listener)
        return () => {
            window.api.removeEventListener('return-path', listener);
        }
    }, [])

    useEffect(() => {
        const listener = (event, message) => {
            appendMessage(message)
        }
        window.api.displayMessageFromServer(listener)
        return () => {
            window.api.removeEventListener('display-server-message', listener);
        }
    }, [])

    function createMessageHelper(status, message, sender) {
        const newMessageObject = {
            status: status,
            content: { "message": message },
            sender: sender,
        }
        appendMessage(newMessageObject)
    }

    function removeMessage(index) {
        setUserMessages(messages => {
            const newMessages = [...messages]
            newMessages.splice(index, 1)
            return newMessages
        })
    }

    function appendMessage(message) {
        setUserMessages(messages => {
            const newMessages = [...messages]
            newMessages.push(message)
            return newMessages
        })
    }

    return (
        <ConfigProvider value={{ userConfig, setUserConfig }}>
            <PathProvider value={{ filePath, setFilePath }}>
                <UserMessagesProvider value={{ createMessageHelper }}>
                    <div className={classes.messageContainer}>
                        {
                            userMessages.map((message, index) => {
                                return <div className={message.status === "success" ? classes.messageBox : `${classes.messageBox} ${classes.failure}`} key={`message_${index}`}>
                                    <span className={classes.message} dangerouslySetInnerHTML={{ __html: message.content.message }} ></span>
                                    <button onClick={() => removeMessage(index)} className={classes.btn}>
                                        <FontAwesomeIcon icon={faXmark} className={classes.close} />
                                    </button>
                                </div>
                            })
                        }

                        {
                            userMessages.length > 0 && <button
                                className={classes.closeAll}
                                onClick={() => setUserMessages([])}
                            >
                                Close all
                            </button>
                        }
                    </div>
                    <Outlet />
                </UserMessagesProvider>
            </PathProvider>
        </ConfigProvider>
    );
};

export default ContextLayout;
