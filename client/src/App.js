import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Authentication from './pages/Authentication';
import Home from './pages/Home'
import StartAccount from './pages/StartAccount';
import FinishAccount from './pages/FinishAccount';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    
      <Router>
        <Switch>
          <Route path='/auth'>
            <Authentication />
          </Route>
          <ProtectedRoute exact={true} path='/' component={Home} />
          <ProtectedRoute path='/start' component={StartAccount} />
          {/* <Route path='/start-1'>
            <FinishAccount />
          </Route> */}
        </Switch>
      </Router>
  );
}

export default App;
