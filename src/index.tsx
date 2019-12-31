import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import './index.css';
import { Provider, connect } from 'react-redux';
import store from './js/store';

import Slavemind from './components/slavemind/App';
import Stars from './components/stars/App';
import Firefly from './components/firefly/App';

interface Props {
  appId: number | string;
}

const App = ({ appId }: Props) => {
  switch (appId) {
    case 'stars':
    return <Stars />;
    case 'firefly':
    return <Firefly />;
    default: 
    return <Slavemind />;
  }
};

const mapStateToProps = ({ appId }: Props) => ({ appId });
const AppContainer = connect(mapStateToProps)(App);

ReactDOM.render(
  <Provider store={store}>
  <AppContainer />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
unregister();
