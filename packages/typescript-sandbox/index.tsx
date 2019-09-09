import '../typescript-playground/react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from '../typescript-playground/node_modules/@types/react-dom';
import { Thing } from '../playground/dist';

const App = () => {
  return (
    <div>
      <Thing />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
