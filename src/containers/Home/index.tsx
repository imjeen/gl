import React from 'react';

import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';

export default function Home() {
    const { path } = useRouteMatch();

    return (
        <>
            <Switch>
                <Route exact path={path}>
                    <Redirect to={`/demo`} />
                </Route>
            </Switch>
        </>
    );
}
