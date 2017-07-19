var express = require("express")
//Handlebars hbs for {{easy frontend}}
var hbs = require("hbs")
var fs = require('fs')
var morgan = require('morgan')
var app = express();
hbs.registerPartials(__dirname + '/views/partials')
// View Engine .... hbs to be used for the whole project
app.set('view engine', 'hbs');
//Routers --- using router to get to our api ... it means it wont be a default site on specific server!
var router = express.Router();
//morgan for logging ... // Middleware for logs ..
var accessLogStream = fs.createWriteStream(__dirname + '/access.log',{flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}))
// Manual Middleware - we can even log our access logs to a file or console.
//will make a log file to our system through this ..
router.use((req,res,next) => {
  date = new Date();
  var log = `${date}client_ip: ${req.ip} requested page: ${req.path}`;
  //console.log(`${date}client_ip: ${req.ip}requested page: ${req.path}`);
  fs.appendFile('server.log',log + '\n',(err)  => {   // to avoid deprication warning & error, use (err) => in code.
    if (err) {
      console.log('unable to append to server.log')
    }
  });
  next();
});

// Maintenance mode ..... Middleware

// app.use((req,res,next)=>{
//   res.render('maintenance.hbs');
// });

app.use('/api', router);
//Using Built In Middleware in Express- it can be used to log requests - and we can stop it right here.
// we changed it from app.use to router.use ---- as we are using router in our app.



router.use(express.static(__dirname + '/public'));
//home page through api router
  router.get('/', (req,res) => {
  //  res.send("HELLO EXPRESS");
    res.render('home.hbs',{
      welcomeHome : "Welcome to Node.js Home Page",
      paragraph: "this page is rendered via hbs model installed and added to our project. its awesome to have something like this!!!",
      CurrentYear: new Date().getFullYear(),
      CurrentDate: new Date().getDate(),
      CurrentMonth: new Date().getMonth()+1,
      name: "Malik",
      hobbies:[
        "biking",
        "watching movies"

      ]
    });
  });


// using hbs to render our /about.hbs ... server will serve page from views / about.hbs
router.get('/about', (req,res) => {
  res.render('about.hbs',{
    PageTitle: "About My App - hbs ",
    CurrentYear: new Date().getFullYear(),
    CurrentDate: new Date().getDate(),
    //month needs to be with +1 because JS starts counting of month from 0
    CurrentMonth: new Date().getMonth()+1,
    name: "Malik",
    hobbies:[
      "biking & ",
      "watching movies"
    ]
  });
});

//page not found ..... anything which doesnt have route info will be to 404

router.get('/*', (req,res) => {
  res.send("<h1>404 Page not found!</h1>");
  //tried error log but didnt work through below method ...
  //var accessLogStream = fs.createWriteStream(__dirname + '/error.log');
  //app.use(morgan('combined', {stream: accessLogStream}))
});

app.listen(3000);
//console.log("\n");
console.log("Server is up on http://localhost:3000");
//console.log(req.method);
