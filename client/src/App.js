import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Authentication from './pages/Authentication';
import Home from './pages/Home'
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import MatchUp from './pages/MatchUp';
import Search from './pages/SearchUsers';
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
          <ProtectedRoute path='/start' component={StartAccount} />
          <ProtectedRoute path='/profile' component={Profile} />
          <ProtectedRoute path='/messages' component={Messages} />
          <ProtectedRoute path='/match' component={MatchUp} />
          <ProtectedRoute path='/user-search' component={Search} />
        </Switch>
      </Router>
  );
}

export default App;
