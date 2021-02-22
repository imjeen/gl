import React, { useState } from 'react';

import { Switch, Route, useRouteMatch, useHistory, useLocation } from 'react-router-dom';

import { NavBar, Icon, Drawer, List } from 'antd-mobile';
import styles from './styles.module.less';

import HelloWorld from './HelloWorld';

const ROUTES = [
    {
        name: '全部',
        route: '/demo',
        component: null,
    },
    {
        name: 'hello-world',
        route: '/demo/hello-world',
        component: <HelloWorld />,
    },
];

export default function Demo() {
    const { path } = useRouteMatch();
    const { pathname } = useLocation();
    const history = useHistory();

    const [state, setState] = useState({
        open: false,
    });

    const findRoute = ROUTES.find(({ route }) => route === pathname);

    const topTitle = findRoute ? findRoute.name : 'Demo';

    const onOpenChange = () => {
        setState({ ...state, open: !state.open });
    };

    const onRoute = (route: string) => {
        setState({ ...state, open: false });
        pathname !== route && history.push(route);
    };

    const onReload = () => {
        window.location.reload();
    };

    const sidebar = (
        <List>
            {ROUTES.map(({ route, name }, index) => {
                return (
                    <List.Item
                        className={pathname === route ? 'active' : ''}
                        key={index}
                        multipleLine
                        onClick={() => onRoute(route)}
                    >
                        {name}
                    </List.Item>
                );
            })}
        </List>
    );

    return (
        <>
            <NavBar
                className={styles.navBar}
                mode="dark"
                icon={<Icon type="ellipsis" />}
                onLeftClick={onOpenChange}
                rightContent={<Icon onClick={() => onReload()} type="check-circle" />}
            >
                {topTitle}
            </NavBar>
            <Drawer
                className={styles.drawer}
                style={{ minHeight: document.documentElement.clientHeight }}
                enableDragHandle={false}
                sidebar={sidebar}
                open={state.open}
                onOpenChange={onOpenChange}
            >
                <Switch>
                    <Route path={`${path}`} exact>
                        This is the demo home page.
                        {/* {ROUTES.map(({ route, component }) => (
                            <React.Fragment key={route}>{component}</React.Fragment>
                        ))} */}
                    </Route>

                    {ROUTES.map(
                        ({ route, component }) =>
                            component && (
                                <Route key={route} path={route}>
                                    {component}
                                </Route>
                            ),
                    )}

                    <Route path={`${path}/*`}>
                        <>404</>
                    </Route>
                </Switch>
            </Drawer>
        </>
    );
}
