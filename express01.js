const express = require('express');
const Twig = require("twig");
const bodyParser = require('body-parser');
const { check, validationResult, matchedData } = require('express-validator');
const app = express();

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))
const urlencodedParser = bodyParser.urlencoded({ extended: false })

 
// parse application/json
//app.use(bodyParser.json())
const jsonParser = bodyParser.json();

//ใช้ในการอ้างถึงไฟล์ใน index01.html
app.use('/',express.static('public'))

//middleware
const Validation = function(req,res,next) {
    console.log('Middleware Working');
    next();
}

//assign validation
//app.use(Validation);

app.get("/", (req,res) => {
    // res.send("<h1>Express</h1>")
    res.sendFile(__dirname+'/index01.html')
});

app.get("/users", Validation, (req,res) => {
    res.send("<h1>User Data Accessed</h1>")
});

// This section is optional and used to configure twig.
app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});
app.set('view engine', 'twig')
app.set('views', './public/views')

app.get("/twig", (req,res) => {
    res.render('index.html.twig', {
        title: "Login Form",
        message: "Enter Username and Password",
        username: "guest01@gmail.com",
        password: "12345678",
        cpassword: "12345678"
    });
})

app.post(
    "/twig", 
    urlencodedParser,
    check('username','Username should be email').isEmail(),
    check('password','Password must be in 5 charactors').isLength({ min: 5 }),
    check('cpassword','Confirm Password must be in 5 charactors').isLength({ min: 5 }),
    check('cpassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
    
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    (req,res) => {
        const errors = validationResult(req);
        console.log(errors.mapped());
        if (!errors.isEmpty()) {
            //return res.status(400).json({ errors: errors.array() });
            //return res.status(400).json(errors.mapped());
            //console.log(errors.mapped())
            res.render('index.html.twig', {
                title: "Login Form",
                message: "Enter Username and Password",
                username: req.body.username,
                password: req.body.password,
                cpassword: req.body.cpassword,
                error: errors.mapped()
            });
        } else {
            const user = matchedData(req);
            console.log(user);
            res.render('login.html.twig', {
                title: "Success Login",
                message: "User Details",
                user: user,
                error: errors.mapped()
            });
        }
        
})

app.get("/twig/about", (req,res) => {
    res.render('about.html.twig', {
        title: "About Template",
        message : "Hello world!"
    });
})

app.get("/twig/calculus/:a-:b", (req,res) => {
    res.render('calculator.html.twig', {
        title: "Calculus Template",
        sum: (parseInt(req.params.a) + parseInt(req.params.b)),
        sub: (parseInt(req.params.a) - parseInt(req.params.b)),
        mul: (parseInt(req.params.a) * parseInt(req.params.b)),
        div: (parseInt(req.params.a) / parseInt(req.params.b))
    });
})

app.listen(3000,() => {console.log("Server running on port: 3000")})

