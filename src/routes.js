import React from 'react';
import Loadable from 'react-loadable'
// import DefaultLayout from './containers/DefaultLayout';
import { Home } from './views/Pages';
// import { PrivateRoute } from './middleware/middleware-route';
function Loading() {
  return <div>Loading...</div>;
}


const Vote = Loadable({
  loader: () => import('./views/Vote'),
  loading: Loading,
});


const Dashboard = Loadable({
  loader: () => import('./views/Dashboard'),
  loading: Loading,
});

const Data = Loadable({
  loader: () => import('./views/Data'),
  loading: Loading,
});



// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/home',  name: 'Home', component: Home },
  { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/dashboard/vote', name: 'Vote', component: Vote },
  { path: '/dashboard/data', name: 'Data', component: Data },
 
];

export default routes;
