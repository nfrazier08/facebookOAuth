const express = require('express');
//passport is our authentication model
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
//Backend server will be making api requests
const request = require('request');
//A session is where all of your data is- express manages the session for you through cookies
    //and sends the cookie id to the client
    //The backend can remember information about the person and who is making the request
const session = require('express-session');

const PORT = 8080;
const app = express();

//Define constants for fb app
const FACEBOOK_APP_ID = '1481722811954864';
const FACEBOOK_APP_SECRET = 'whatEverYourAppClientSecretIs';

//App setup 
    //First part is the configuration object and how it makes the request to auth the application
passport.use(new facebookStrategy({
    clientID: FACEBOOK_APP_ID, 
    clientSecret: FACEBOOK_APP_SECRET, 
    callbackURL: `http://localhost:${PORT}/auth/facebook/done`
}, 
//callback function will receive accessTokes, etc..
function (accessToken, refreshToken, profile, done) {
    console.log(`${profile.displayName} has logged in`);
    console.log(`accessToken = ${accessToken}`);
    console.log(`refreshToken = ${refreshToken}`);
    console.log(`profile = ${JSON.stringify(profile, null, 2)}`);
    profile.accessToken = accessToken;
    done(null, profile);
    }
));

//called once, once the user is logged in
passport.serializeUser(function(user, done){
    done(null, user);
});

//calls everytime it has to get whatever is stored in the cache out
passport.deserializeUser(function(user, done){
    done(null, user);
});

//This is from the express session module -express how to manage a session
app.use(session({
    secret: 'arbitrary string',
    resave: false, 
    //only save session data if officially initialized
    saveUninitialized: false,
}));

app.use(passport.initialize());
//Tell express what to do with session in relation to passport
app.use(passport.session());

//ROUTES:
//This will be an unauthenticated page
app.get('/', (req, res) => {    
    let body = '<h1> Facebook OAuth Homepage </h1>';

    if(req.isAuthenticated()) {
        body += `Welcome ${req.user.displayName}<br />`;
        body += '<a href="/logout">Click to logout</a>';
    } else {
        body += '<a href="/auth/facebook">Click to log in</a>'
    }
    res.send(body);
});

//This is where we go to log into facebook
app.get('/auth/facebook', 
    passport.authenticate('facebook'));

//This is where we check to see if the login was successful or not
app.get('/auth/facebook/done', 
    passport.authenticate('facebook', {
        successRedirect: '/private', 
        failureRedirect: '/'
    }));

//Authenticated page that is only available when the user is authenticated
app.get('/private', isLoggedIn(), (req, res) => {    
    let body = '<h1>This is a private page</h1>';
    body += `Welcome ${req.user.displayName}`;
    res.send(body);
});

function isLoggedIn(){
    return function(req, res, next){
        if (req.isAuthenticated())
            return next();
        else
            res.sendStatus(401);
            //You can send user back to login back if you here
    };
}

app.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/afterlogout');
})

app.get('/afterlogout', (req, res) => {
    res.send('You have been logged out, <a href ="/">Click here</a> to return to main.');
})


app.listen(PORT, () => console.log(`Server running on ${PORT}`))