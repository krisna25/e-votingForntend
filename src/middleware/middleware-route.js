import React from 'react';
import {  Route, Redirect } from 'react-router-dom';
import { tokenAuth } from './cookies-manager';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authToken, dataToken } = tokenAuth.tokenAuthenticated();
  const adminRoute = { ...rest };
  if (!authToken) {
    return (
    <Redirect to={{
          pathname: '/403',
          state: {
            from: rest.path,
            errorMessage: 'Harap login dahulu.',
          },
        }}
    />
    );
  } 
  if (adminRoute.roles.length > 1) {
    return (
      <Route
        {...rest}
        render={propsRender => (
          authToken && dataToken.role === 0 ? (
            <Component {...propsRender} />
      ) : (
        <Redirect to={{
          pathname: '/home',
        }}
        />
      )
    )}
      />
    );
  }

  return (
    <Route
      {...rest}
      render={propsRender => (
        <Component {...propsRender} />
  )}
    />
  );
};


// const IsLoggedRoute = ({ component: Component, ...rest }) =>
//   // console.log(tokenAuth.tokenAuthenticated());
//   (
//     <Route
//       {...rest}
//       render={props => (
//         <Component
//           {...props}
//           isLoginAuthenticated={tokenAuth.tokenAuthenticated().authToken}
//         />
//   )}
//     />
//   );


export {
  PrivateRoute
};