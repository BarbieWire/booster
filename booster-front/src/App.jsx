import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import ContextLayout from './layout/ContextLayout';

import MainPage from './pages/Main';
import SettingsPage from './pages/Settings';
import FileManagementPage from './pages/FileManagement';



function App() {
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route element={<ContextLayout />}>
                        <Route path='/' element={<MainPage />}></Route>
                        <Route path='/settings' element={<SettingsPage />}></Route>
                        <Route path='/file' element={<FileManagementPage />}></Route>
                    </Route>
                </Routes>
            </HashRouter>
        </div>
    );
}

export default App;
