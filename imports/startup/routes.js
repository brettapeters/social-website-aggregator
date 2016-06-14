import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';

// route components
import App from '../ui/layouts/App.jsx';
import Home from '../ui/pages/Home.jsx';
import ShowPost from '../ui/pages/ShowPost.jsx';
import NotFoundPage from '../ui/pages/NotFoundPage.jsx';

const Routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="posts/:postId" component={ShowPost} />
    </Route>
    <Route path="*" component={NotFoundPage} />
  </Router>
);

ReactRouterSSR.Run(Routes);