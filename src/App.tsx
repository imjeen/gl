import React from 'react';
import { Route, HashRouter } from 'react-router-dom';

import Home from '@/containers/Home';
import Demo from '@/containers/Demo';
import Draw from '@/containers/Draw';

function App() {
    return (
        <>
            <HashRouter>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/demo">
                    <Demo />
                </Route>
                <Route path="/draw">
                    <Draw />
                </Route>
            </HashRouter>
        </>
    );
}

export default App;
