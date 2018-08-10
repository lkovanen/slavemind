import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import { unregister } from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
unregister();
