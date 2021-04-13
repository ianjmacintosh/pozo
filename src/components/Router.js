import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
import Board from "./Board";
import FileNotFound from "./FileNotFound";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App}></Route>
        <Route exact path="/play" component={Board}></Route>
        <Route exact path="/credits" component={App}></Route>
        <Route exact path="/instructions" component={App}></Route>
        <Route component={FileNotFound}></Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
