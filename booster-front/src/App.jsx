import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';

import MainPage from './pages/Main';
import SettingsPage from './pages/Settings';
import SelectFilePage from './pages/SelectFile';


function App() {
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route path='/' element={<MainPage />}></Route>
                    <Route path='/settings' element={<SettingsPage />}></Route>
                    <Route path='/file' element={<SelectFilePage />}></Route>
                </Routes>
            </HashRouter>
        </div>
    );
}

export default App;
