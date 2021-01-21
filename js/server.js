const express = require("express")
const app = express();

/* PASSORD OG SESSION KODE */
var session = require("express-session");
var mongoose = require("mongoose");
var User = require(__dirname + "/models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var emailValidator = require("email-validator");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {
                    message: "Unknown User"
                });
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: "Invalid password"
                    });
                }
            });
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


// TILKOBLING TIL DATABASE (MONGODB)
mongoose.connect("mongodb://localhost/studyhub", {useNewUrlParser: true});
var db = mongoose.connection;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static("public"))


// Express Session
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.get("/", function(req, res) {
    if (req.user) {
        res.redirect("/home");
    } else {
        res.render("index", {
            user: req.user,
            path: req.path,
        });
    }
});


/*app.get("/home", function(req, res) {
    res.render("home", {
        user: req.user,
        path: req.path,
    });
})


app.get("/case", function(req, res) {
    res.render("case", {
        user: req.user, 
        path: req.path,
    });
})

app.get("/apps", function(req, res) {
    if (!req.user) {
        res.redirect("/")
    } else {
        Apps.find({owner: req.user._id}, function(err, apps) {
            var appsMap = {};
            apps.forEach(function(app) {
                appsMap[app._id] = app;
            });

            res.render("apps", {
                user: req.user,
                path: req.path,
                apps: appsMap,
            });
        });
    };
})*/

// login
app.get("/login", function(req, res) {
    if (req.user) {
        res.redirect("/");
    } else {
        res.render("login");
    }
});

app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"
}), function(req, res) {
    res.redirect("https://mythirdazurewebapp20180701124638.azurewebsites.net/events.html");
});

// Endpoint til logout
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.get("/register", function(req, res) {
    if (req.user) {
        res.redirect("/");
    } else {
        res.render("register");
    }
});


// Registrer nye brukere
app.post("/register", function(req, res) {
    User.getUserByUsername(req.body.username, function(err, user) {
        if (user) {
            res.status(500).send("User exists").end();
        } else {
            var password = req.body.password;
            var password2 = req.body.password2;

            if ((password == password2) && (password.length > 0) && (req.body.name.length >= 3) && (req.body.username.length >= 3) && (emailValidator.validate(req.body.email))) {
                var newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                });

                User.createUser(newUser, function(err, user) {
                    if (err) throw err;
                    res.redirect("/login");
                });
            } else {
                res.status(500).send("Invalid user creation").end()
            }
        }
    })
});


app.get("/users", function(req, res) {
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
            userMap[user._id] = user;
        });

        res.send(userMap);
    });
});

app.get("/clear", function(req, res) {
    User.remove({}, function(err) {
        res.redirect("/");
    })
})

app.listen(3069, function() {
    console.log("Landing page up & running!")
})