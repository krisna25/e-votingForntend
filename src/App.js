import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'
import { PrivateRoute } from './middleware/middleware-route';

// Containers
import { DefaultLayout } from './containers';
// Pages
import { Login, Page403, Page404, Page500, Register, Home, Hasil, PrintHasil } from './views/Pages';

// import { renderRoutes } from 'react-router-config';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/home" name="home" component={Home}  />
          <Route exact path="/home/hasil" name="home" component={Hasil}  />
          <Route path="/home/hasil/print/" name="Print Page" component={PrintHasil} />
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/register" name="Register Page" component={Register} />
          <Route exact path="/403" name="Page 403" component={Page403} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <PrivateRoute path="/dashboard/vote" name="vote" component={DefaultLayout}  roles={["user"] }/>
          <PrivateRoute path="/dashboard/" name="dashboard" component={DefaultLayout}  roles={["admin","user"] }/>
          <PrivateRoute path="/dashboard/data" name="data" component={DefaultLayout}  roles={["admin","user"] }/>
          <Redirect from="/" to="/home" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
