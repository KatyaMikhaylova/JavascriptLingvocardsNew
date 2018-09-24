const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const i18n=require("i18n-x");
const cookieParser = require('cookie-parser');
const mcache = require('memory-cache');

mongoose.Promise = Promise;
mongoose.connect(config.database
    , {
    useMongoClient: true,
        promiseLibrary: global.Promise
}
);
let db = mongoose.connection;


// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Collection = require('./models/collection');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));
let MemoryStore = require('memorystore')(session);
//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
    store: new MemoryStore(
        {
            checkPeriod: 86400000 // prune expired entries every 24h
        }
    )
}));
app.set('trust proxy', 1);

// app.use(session({
//     cookie:{
//         secure: true,
//         maxAge:60000
//     },
//     store: new MongoStore({ mongooseConnection: db }),
//     secret: 'secret',
//     saveUninitialized: true,
//     resave: false
// }));

app.use(function(req,res,next){
    if(!req.session){
        return next(new Error('Oh no')) //handle error
    }
    next() //otherwise continue
});
// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      let namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


app.use(i18n({
    locales      : ['ru','en'],
    defaultLocale: 'ru',
    cookie:'lang',
    objectNotation: true,

}));


app.get ('/ru', function (req,res) {
    res.cookie('lang', 'ru', {maxAge:900000, httpOnly:true});
    res.redirect('back');
});
app.get ('/en', function (req,res) {
    res.cookie('lang', 'en', {maxAge:900000, httpOnly:true});
    res.redirect('back');
});
// let cache = (duration) => {
//     return (req, res, next) => {
//         let key = '__express__' + req.originalUrl || req.url
//         let cachedBody = mcache.get(key)
//         if (cachedBody) {
//             res.send(cachedBody)
//             return
//         } else {
//             res.sendResponse = res.send
//             res.send = (body) => {
//                 mcache.put(key, body, duration * 1000);
//                 res.sendResponse(body)
//             }
//             next()
//         }
//     }
// }


// Home Route
app.get('/',    function(req, res){
  Collection.find({}, function(err, cards){
    if(err){
      console.log(err);
    } else {

      res.render('index', {

        cards: cards,
          locale: req.i18n.getLocale()
          //locale:req.cookie.lang
      });


    }
  });

});


// Route Files
let collections = require('./routes/collections');
let cards = require('./routes/cards');
let users = require('./routes/users');
let own = require('./routes/own');
let lingvo = require('./routes/lingvo');

app.use('/cards', cards);
app.use('/collections', collections);
app.use('/users', users);
app.use('/own', own);
app.use('/lingvo', lingvo);

// Start Server
app.listen(process.env.PORT ||6633, function(){
  console.log('Server started on port 6633...');
});
