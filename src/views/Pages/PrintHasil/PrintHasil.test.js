import React from 'react';
import ReactDOM from 'react-dom';
import PrintHasil from './PrintHasil';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PrintHasil />, div);
  ReactDOM.unmountComponentAtNode(div);
});
