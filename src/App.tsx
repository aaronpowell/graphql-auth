import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { PostList } from "./components/PostList";
import { Home } from "./pages/Home";
import { NewPost } from "./pages/NewPost";
import { Post } from "./pages/Post";
import styles from "./App.module.css";
import { UserInfo } from "./components/UserInfo";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthorIdentity } from "./components/AuthorContextProvider";
import LoginCallback from "./pages/LoginCallback";

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <AuthorIdentity>
          <div className={styles.app}>
            <aside>
              <PostList />
              <UserInfo />
            </aside>
            <section role="main">
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
                <PrivateRoute path="/post/create" exact>
                  <NewPost />
                </PrivateRoute>
                <Route path="/post/:id">
                  <Post />
                </Route>
                <Route path="/login-callback">
                  <LoginCallback />
                </Route>
              </Switch>
            </section>
          </div>
        </AuthorIdentity>
      </ApolloProvider>
    </Router>
  );
}

export default App;
