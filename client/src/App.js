import { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from "./components/auth/Login";
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
import { loadUser } from './actions/auth';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile-form/ProfileForm';
import PrivateRoute from './components/routing/PrivateRoute';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import NavbarHome from './components/layouts/NavbarHome';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
//redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';

const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Switch>
            <Route exact path="/" component={NavbarHome}/>
            <Route>
              <Navbar/>
            </Route>
          </Switch>
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profiles" component={Profiles}/>
              <Route exact path="/profile/:id" component={Profile}/>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-profile" component={ProfileForm} />
              <PrivateRoute exact path="/edit-profile" component={ProfileForm}/>
              <PrivateRoute exact path="/add-experience" component={AddExperience}/>
              <PrivateRoute exact path="/add-education" component={AddEducation}/>
              <PrivateRoute exact path="/posts" component={Posts}/>
              <PrivateRoute exact path="/posts/:id" component={Post}/>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
