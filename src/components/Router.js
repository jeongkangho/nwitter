import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';

const AppRouter = ({refreshUser, isLoggedIn, userObj}) => {
    // const [isLoggedIn, setIsLoggedIn] = useState(true);
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <Switch>
                {isLoggedIn ? (
                    <>
                    <div
                        style={{
                        maxWidth: 890,
                        width: "100%",
                        margin: "0 auto",
                        marginTop: 80,
                        display: "flex",
                        justifyContent: "center",
                        }}
                    >
                        <Route exact path="/">
                            <Home userObj={userObj}/>
                        </Route>
                        <Route exact path="/profile">
                            <Profile userObj={userObj} refreshUser={refreshUser}/>
                        </Route> 
                        {/* <Redirect from='*' to='/' /> */}
                    </div> 
                    </>
                ) : (
                    <>
                        <Route exact path="/"> 
                            <Auth /> 
                        </Route>
                        {/* <Redirect from='*' to='/' /> */}
                    </>
                )}
            </Switch>
        </Router>
    );
};

export default AppRouter;
