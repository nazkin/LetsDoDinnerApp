import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Authentication from './pages/Authentication';
import Home from './pages/Home'
import StartAccount from './pages/StartAccount';
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
          <ProtectedRoute path='/get-started' component={StartAccount} />
        </Switch>
      </Router>
  );
}

export default App;
