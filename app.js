const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session = require('express-session');
const passport= require('passport');
const bodyParser=require('body-parser');

const app=express();
require('./config/passport')(passport);

const db = require('./config/keys').MongoURI;
mongoose.connect(db,
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err=>console.log(err));

const PORT = 5000;

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');


app.use(express.urlencoded({ extended: true}));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitalized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    next();
});

app.use('/',require('./routes/index'));
app.use('/',require('./routes/users'));
app.listen(PORT, console.log(`Server started on port ${PORT}`));