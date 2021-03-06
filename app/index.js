import React from 'react';
import ReactDom from 'react-dom';
import { StoreContext } from 'redux-react-hook';
import configureStore from './store/configureStore';
import App from './components/App';

const store = configureStore();

ReactDom.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const Root = require('./components/App').default;

    ReactDom.render(
      <StoreContext.Provider value={store}>
        <Root />
      </StoreContext.Provider>,
      document.getElementById('app')
    );
  });
}
