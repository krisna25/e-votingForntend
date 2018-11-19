import React from 'react';
import ReactDOM from 'react-dom';
import Hasil from './hasil';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hasil />, div);
  ReactDOM.unmountComponentAtNode(div);
});
