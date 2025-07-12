//module imports

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const encrypt= require("mongoose-encryption");
const session = require('express-session');

const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
require('dotenv').config();


var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));








//data base setup//
 const mongoose = require('mongoose');
  const userSchema = new mongoose.Schema({
    email: String ,
    password: String,
    username:String,
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  secrets: {
  type: [String],
  default: []
}

});

const User = mongoose.model("User", userSchema);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

    






// Configure sessions
app.use(session({
  name: 'myapp.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: MongoStore.create({
    
    client: mongoose.connection.getClient(),
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // session expiration in seconds
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day in ms
  }
}));




const JWT_SECRET = 'process.env.jwt_SECRET';



//on server load home page show//
app.get("/",function(req,res){
    res.render("home");
})
//login page show//
app.get("/login",function(req,res){
    res.render("login");
})

//sign up page//
app.get("/signup",function(req,res){
    res.render("signup");
})

// securely store password using bcrypt
app.post("/signup", async function (req, res) {
  const { email, username, password, confirmpassword } = req.body;

  try {
    if (!email || !username || !password || !confirmpassword) {
      return res.status(400).send("❗ All fields are required.");
    }

    if (password !== confirmpassword) {
      return res.render("signup", { alert: { type: 'danger', message: "❌ Passwords do not match" } });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email }, );
    if (existingUser) {
      return res.render("signup", { alert: { type: 'danger', message: " User already exists" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      username,
      password: hashedPassword
    });

    res.redirect("/login");
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).send("Internal server error");
  }
});
//login authentication
app.post("/login", async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', { alert: { type: 'danger', message: 'User not found.' } });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('login', { alert: { type: 'danger', message: 'Invalid password.' } });
    }

    // Save user info to session
    req.session.user = {
      email: user.email,
      username: user.username,
      role: user.role
    };

    // Create JWT payload
    const payload = {
      username: user.username,
      role: user.role
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Optional: Set token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000
    });

    // Redirect to secrets page
    return res.redirect("/secrets");

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error.");
  }
});



      
   

//protected route//
app.get("/secrets", function(req, res) {
    if (req.session.user) {
        res.render("secrets", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
});

app.post('/save-secrets', authenticate, async (req, res) => {
  try {
    const secret = req.body.secret;
    const username = req.session.user?.username;

    if (!username) {
      return res.status(401).send("Unauthorized: No active session");
    }

    await User.findOneAndUpdate(
      { username },
      { $push: { secrets: secret } }
    );

    res.render("secrets", { alert: { type: 'success', message: "✅ Your secret has been safely stored." } });
  } catch (err) {
    console.error("Error storing secret:", err);
    res.status(500).send("Something went wrong.");
  }
});





//logout route//
app.get("/logout", function(req, res) {
    req.session.destroy();
    res.clearCookie('myapp.sid');
   
    res.redirect("/");
    // alert youre log out 
    //res.render("home", { alert: { type: 'success', message: "✅ You have successfully logged out." } });
});






//middleware to check authentication
function authenticate(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).send("Unauthorized: No active session");
}

app.listen(5000, function() {
  console.log("Server started on port 5000");
});
