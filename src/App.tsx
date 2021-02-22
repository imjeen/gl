import React from 'react';
import { Route, HashRouter } from 'react-router-dom';

import Home from '@/containers/Home';
import Demo from '@/containers/Demo';

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
            </HashRouter>
        </>
    );
}

export default App;
