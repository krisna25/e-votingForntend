import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import {tokenAuth} from '../../middleware/cookies-manager';
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigationAdmin from '../../_navAdmin';
import navigationUser from '../../_navUser';
// routes config
import routes from '../../routes';
// import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

class DefaultLayout extends Component {
  render() {
    const {dataToken} = tokenAuth.tokenAuthenticated();
    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader  userData = {dataToken}/>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            {dataToken.role === 0 ?(
              <AppSidebarNav navConfig={navigationAdmin} {...this.props} />
            ):(
              <AppSidebarNav navConfig={navigationUser} {...this.props} />
            )}
            
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <Container fluid style={{marginTop:'2em'}}>
              <Switch>
                {routes.map((route, idx) => {
                    return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component {...props} />
                      )} />)
                      : (null);
                  },
                )}
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </Container>
          </main>
        </div>
        <AppFooter className="homeBackground text-white" >
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
