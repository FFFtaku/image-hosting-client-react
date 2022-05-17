import { Fragment } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import routes from './routes';
import './App.scss';

export default function App() {
  const elements = useRoutes(routes);
  const location = useLocation();
  console.log(location)

  return (
    <div className="app">
      <TransitionGroup>
        <CSSTransition
          className="xxx"
          classNames={'fade'}
          appear={true}
          timeout={{
            appear: 500,
            enter: 500,
            exit: 300,
          }}
          key={location.key}
        >
          {elements}
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};
