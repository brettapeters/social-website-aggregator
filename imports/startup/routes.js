import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import App from '../ui/App.jsx';
import Post from '../ui/Post.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="posts/:id" component={Post} />
    </Route>
  </Router>
);