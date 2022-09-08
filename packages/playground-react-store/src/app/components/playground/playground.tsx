import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { BUTTONS } from './demos.constants';

import { Welcome } from '../welcome';
import { AppHeader } from './app-header';

export const Playground: React.FC = () => {
  return (
    <BrowserRouter>
      <AppHeader buttons={BUTTONS} />
      <Switch>
        {BUTTONS.map((it, i) => {
          return <Route path={it.url} component={it.component} key={i}></Route>;
        })}
        <Route path="/" component={Welcome} key={99}></Route>
      </Switch>
    </BrowserRouter>
  );
};
