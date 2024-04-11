import './App.css';

import {BrowserRouter as Router, Route, RouterProvider, } from 'react-router-dom';
import router from "./AppRouter.jsx";
function App() {
    return (
        <>
            <RouterProvider router={router}/>
        </>
    );
}

export default App;