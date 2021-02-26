import React, { useState } from 'react';

import { Switch, Route, useRouteMatch, useHistory, useLocation } from 'react-router-dom';

import { NavBar, Icon, Drawer, List } from 'antd-mobile';
import styles from './styles.module.less';

import HelloWorld from './HelloWorld';
import Point from './Point';
import Line from './Line';
import Triangle from './Triangle';
import Texture from './Texture';
import Coordinate from './Coordinate';
import Matrix from './Matrix';
import Cube from './Cube';

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
    {
        name: 'Point',
        route: '/demo/point',
        component: <Point />,
    },
    {
        name: 'Line',
        route: '/demo/line',
        component: <Line />,
    },
    {
        name: 'Triangle',
        route: '/demo/triangle',
        component: <Triangle />,
    },
    {
        name: 'Texture',
        route: '/demo/texture',
        component: <Texture />,
    },
    {
        name: 'Coordinate',
        route: '/demo/coordinate',
        component: <Coordinate />,
    },
    {
        name: 'Matrix',
        route: '/demo/matrix',
        component: <Matrix />,
    },
    {
        name: 'Cube',
        route: '/demo/cube',
        component: <Cube />,
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
