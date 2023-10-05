import React, { useState, useEffect } from 'react';

import { Outlet } from 'react-router-dom';

import { ConfigProvider } from '../context/ConfigContext'
import { PathProvider } from '../context/PathContext';


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


    const [severMessages, setServerMessages] = useState([])
    useEffect(() => {
        const listener = (event, result) => {
            setServerMessages([result, ...severMessages])
        }
        window.api.displayMessageFromServer(listener)
        return () => {
            window.api.removeEventListener('display-server-message', listener);
        }
    }, [])

    return (
        <ConfigProvider value={{ configJSON, setConfigJSON }}>
            <PathProvider value={{ filePath, setFilePath }}>
                <Outlet />
            </PathProvider>
        </ConfigProvider>
    );
};

export default ContextLayout;
