const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
//const employeeModel = require('../../modules/employeeModel');
//const uploadModel = require('../../modules/uploadModel');
const app = express();
const router = express.Router();
const mongoosePaginate = require('mongoose-paginate-v2');
const userModel = require('../../modules/userModel');
const passCateModel = require('../../modules/passwordCategory');
const passModel = require('../../modules/passwordDetail');
const bcrypt = require('bcryptjs');
const { check, body, validationResult } = require('express-validator');
//router.use('/',express.static('public'))

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req, res, next) {
    try {
        var userToken = localStorage.getItem('userToken');
        var decode = jwt.verify(userToken, 'loginToken');
        next();
    }catch(err) {
        console.log("123");
        res.redirect('/');
    }
}

function checkEmail(req, res, next) {
    var email = req.body.email;
    var checkExitEmail = userModel.findOne({email: email});
    checkExitEmail.exec((err,data) => {
        if(err) throw err;
        if(data) {
            return res.render('registerForm.html.ejs', {
                title: "Register",
                formTitle: "Register Form",
                msg: {success: '', error: 'Email Already Exit'}
            });
        }
        next();
    });
}

function checkUsername(req, res, next) {
    var username = req.body.username;
    var checkExitUsername = userModel.findOne({username: username});
    checkExitUsername.exec((err,data) => {
        if(err) throw err;
        if(data) {
            return res.render('registerForm.html.ejs', {
                title: "Register",
                formTitle: "Register Form",
                msg: {success: '', error: 'Username Already Exit'}
            });
        }
        next();
    });
}

const getPassCate = passCateModel.find({});
const getPassDetail = passModel.find({});

/* Get Home Page */
router.get('/', function(req,res,next) {
    var loginUser = localStorage.getItem('loginUser');

    if(loginUser) {
        res.redirect('./dashboard')
    } else {
        res.render('loginForm.html.ejs', {
            title: "Password Management System",
            formTitle: "Login Form",
            msg: {success: '', error: ''}
        });
    }    
    
});

router.post('/', function(req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    var checkExitUsername = userModel.findOne({username: username});
    checkExitUsername.exec((err, data) => {
        //console.log(err);
        //console.log(data);
        if(err) throw err;
        if(data) {
            var getPassword = data.password;
            var getUserID = data._id;
            if(bcrypt.compareSync(password, getPassword)) {
                var token = jwt.sign({ userID: getUserID }, 'loginToken');
                localStorage.setItem('userToken', token);
                localStorage.setItem('loginUser', username);
                res.redirect('/dashboard');
                // res.render('loginForm.html.ejs', {
                //     title: "Password Management System",
                //     formTitle: "Login Form",
                //     msg: {success: 'User Logined Successfully', error: ''}
                // });
            } else {
                res.render('loginForm.html.ejs', {
                    title: "Password Management System",
                    formTitle: "Login Form",
                    msg: {success: '', error: 'Invalid Username and Password'}
                });
            }
        }else {
            res.render('loginForm.html.ejs', {
                title: "Password Management System",
                formTitle: "Login Form",
                msg: {success: '', error: 'Invalid Username and Password'}
            });
        }
        
        
    });
});

router.get('/dashboard', checkLoginUser, function(req,res,next) {
    getPassCate.exec(function(err1,data1) {
        if(err1) throw err1;
        getPassDetail.exec(function(err2, data2) {
            if(err2) throw err2;
            res.render('dashboard.html.ejs', {
                title: "Password Management System",
                pageTitle: "User Dashboard",
                records1: data1,
                records2: data2,
                msg: {success: '', error: ''},
                loginUser: localStorage.getItem('loginUser')
            });
        });
    });
    
});


router.get('/register', function(req,res,next) {
    res.render('registerForm.html.ejs', {
        title: "Register",
        formTitle: "Register Form",
        msg: {success: '', error: ''}
    });
    
});

router.post('/register', checkUsername, checkEmail, function(req,res,next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;

    if(password != cpassword) {
        res.render('registerForm.html.ejs', {
            title: "Register",
            formTitle: "Register Form",
            msg: {success: '', error: 'Password not matched!'}
        });
    } else {
        password = bcrypt.hashSync(req.body.password, 10);
        var userDetails = new userModel({
            username: username,
            email: email,
            password: password
        });
    
        userDetails.save((err, doc) => {
            if(err) throw err;
            res.render('registerForm.html.ejs', {
                title: "Register",
                formTitle: "Register Form",
                msg: {success: 'User Registered Successfully', error: ''}
            });
        });
    }
    
    
    
});

router.get('/viewPasswordCategory', function(req,res,next) {
    var perPage = 5;
    var page = req.params.page || 1;

    getPassCate.skip((perPage * page) - perPage).limit(perPage).exec(function(err,data) {
        if(err) throw err;
        passModel.countDocuments({}).exec((err, count) => {
            res.render('passwordCategory.html.ejs', {
                title: "Password Category",
                pageTitle: "Password Category List",
                records: data,
                current: page,
                pages: Math.ceil(count / perPage),
                msg: {success:'',error:''},
                loginUser: localStorage.getItem('loginUser')
            });
        });
        
    });

});

router.get('/addPasswordCategory', checkLoginUser, function(req,res,next) {
    
    res.render('addPasswordCategory.html.ejs', {
        title: "Add Password Category",
        formTitle: "Add Password Category",
        msg: {success:'',error:''},
        loginUser: localStorage.getItem('loginUser')
    });

});

router.post('/addPasswordCategory', checkLoginUser, [ check('passwordCategory','Enter Password Category Name').isLength({ min: 5 }) ], function(req,res,next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors.mapped());
        res.render('addPasswordCategory.html.ejs', {
            title: "Add Password Category",
            formTitle: "Add Password Category",
            msg: {success:'',error: errors.mapped().passwordCategory.msg},
            loginUser: localStorage.getItem('loginUser')
        });
    } else {
        var passCateName = req.body.passwordCategory;
        var passCateDetails = new passCateModel({
            passwordCategory: passCateName
        });
        passCateDetails.save(function(err,doc) {
            if(err) throw err;
            res.render('addPasswordCategory.html.ejs', {
                title: "Add Password Category",
                formTitle: "Add Password Category",
                msg: {success:'Password Category Inserted Successfully',error:''},
                loginUser: localStorage.getItem('loginUser')
            });
        });
        
    }

});

router.get('/passwordCategory/edit/:id', function(req,res,next) {
    var passCateID = req.params.id;
    var passCateEdit = passCateModel.findById(passCateID);
    passCateEdit.exec(function(err,data) {
        console.log(data)
        if(err) throw err;
        res.render('editPasswordCategory.html.ejs', {
            title: "Edit Password Category",
            formTitle: "Edit Password Category",
            records: data,
            msg: {success:'',error:''},
            loginUser: localStorage.getItem('loginUser')
        });
    });

});

router.post('/passwordCategory/edit/', function(req,res,next) {
    var passCateID = req.body.id;
    var passCateName = req.body.passwordCategory;
    var passCateUpdate = passCateModel.findByIdAndUpdate(passCateID, {
        passwordCategory: passCateName
    });
    passCateUpdate.exec(function(err,data) {
        if(err) throw err;
        res.redirect('/viewPasswordCategory');
    });

});

router.get('/passwordCategory/delete/:id', function(req,res,next) {
    var passCateID = req.params.id;
    var passCateDelete = passCateModel.findByIdAndDelete(passCateID)
    passCateDelete.exec(function(err) {
        if(err) throw err;
        res.redirect('/viewPasswordCategory');
    });

});

/*
router.get('/viewPassword', checkLoginUser, function(req,res,next) {
    var perPage = 5;
    var page = 1;

    getPassDetail.skip((perPage * page) - perPage).limit(perPage).exec(function(err, data) {
        if(err) throw err;
        passModel.countDocuments({}).exec((err, count) => {
            res.render('password.html.ejs', {
                title: "Password",
                pageTitle: "Password List",
                records: data,
                current: page,
                pages: Math.ceil(count / perPage),
                msg: {success:'',error:''},
                loginUser: localStorage.getItem('loginUser')
            });
        });
        
    });
    
    
});
*/

/*
router.get('/viewPassword/:page', checkLoginUser, function(req,res,next) {
    var perPage = 5;
    var page = req.params.page || 1;

    getPassDetail.skip((perPage * page) - perPage).limit(perPage).exec(function(err, data) {
        if(err) throw err;
        passModel.countDocuments({}).exec((err, count) => {
            res.render('password.html.ejs', {
                title: "Password",
                pageTitle: "Password List",
                records: data,
                current: page,
                pages: Math.ceil(count / perPage),
                msg: {success:'',error:''},
                loginUser: localStorage.getItem('loginUser')
            });
        });
        
    });

});
*/

router.get('/viewPassword', checkLoginUser, function(req,res,next) {
    var options = {
        offset: 0,
        limit: 5
    };

    passModel.paginate({}, options, function(err, result) {
        console.log(result)
        if(err) throw err;
        res.render('password.html.ejs', {
            title: "Password",
            pageTitle: "Password List",
            records: result.docs,
            current: result.page,
            pages: result.totalPages,
            msg: {success:'',error:''},
            loginUser: localStorage.getItem('loginUser')
        });
    });
    
});

router.get('/viewPassword/:page', checkLoginUser, function(req,res,next) {
    var page = req.params.page || 1;
    var options = {
        offset: ((page-1)*5),
        limit: 5
    };

    passModel.paginate({}, options, function(err, result) {
        console.log(result)
        if(err) throw err;
        res.render('password.html.ejs', {
            title: "Password",
            pageTitle: "Password List",
            records: result.docs,
            current: result.page,
            pages: result.totalPages,
            msg: {success:'',error:''},
            loginUser: localStorage.getItem('loginUser')
        });
    });
    
    
});

router.get('/password/edit/:id', checkLoginUser, function(req,res,next) {
    var passID = req.params.id;
    var passEdit = passModel.findById(passID);
    
    passEdit.exec(function(err, data1) {
        if(err) throw err;
        getPassCate.exec(function(err, data2) {
            res.render('editPassword.html.ejs', {
                title: "Edit Password",
                formTitle: "Edit Password",
                records1: data1,
                records2: data2,
                msg: {success:'',error:''},
                loginUser: localStorage.getItem('loginUser')
            });
        });
    });
    
});

router.post('/password/edit/:id', checkLoginUser, function(req,res,next) {
    var passID = req.body.id;
    var passCate = req.body.passCategory;
    var projectName = req.body.projectName;
    var passDetail = req.body.passDetail;
    var passUpdate = passModel.findByIdAndUpdate(passID, {
        passwordCategory: passCate,
        projectName: projectName,
        passwordDetail: passDetail
    });
    
    passUpdate.exec(function(err) {
        if(err) throw err;
        var passEdit = passModel.findById(passID);
        passEdit.exec(function(err, data1) {
            if(err) throw err;
            getPassCate.exec(function(err, data2) {
                res.render('editPassword.html.ejs', {
                    title: "Edit Password",
                    pageTitle: "Edit Password",
                    records1: data1,
                    records2: data2,
                    msg: {success:'Password Update Successfully',error:''},
                    loginUser: localStorage.getItem('loginUser')
                });
            });
        });
    });
    
});

router.get('/password/delete/:id', checkLoginUser, function(req,res,next) {
    var passID = req.params.id;
    var passDelete = passModel.findByIdAndDelete(passID);
    passDelete.exec((err) => {
        if(err) throw err;
        res.redirect('/viewPassword');
    });
    
});

router.get('/addPassword', checkLoginUser, function(req,res,next) {
    getPassCate.exec(function(err, data) {
        if(err) throw err;
        res.render('addPassword.html.ejs', {
            title: "Add Password",
            pageTitle: "Add Password",
            formTitle: "Add Password",
            records: data, 
            msg: {success:'',error:''},
            loginUser: localStorage.getItem('loginUser')
        });
    });
    
});

router.post('/addPassword', checkLoginUser, function(req,res,next) {
    var passCate = req.body.passCategory;
    var projectName = req.body.projectName;
    var passDetail = req.body.passDetail;
    var passwordDetail = new passModel({
        passwordCategory: passCate,
        projectName: projectName,
        passwordDetail: passDetail
    });
    passwordDetail.save(function(err1, data) {
        if(err1) throw err1;
        getPassCate.exec(function(err2, data) {
            if(err2) throw err2;
            res.render('addPassword.html.ejs', {
                title: "Add Password",
                pageTitle: "Add Password",
                formTitle: "Add Password",
                records: data,
                msg: {success:'Password Detail Inserted Successfully',error:''},
                loginUser: localStorage.getItem('loginUser')
            });
        });
    });
    
});


router.get('/logout',function(req,res,next) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/')
});


router.get('/join', checkLoginUser, function(req,res,next) {

    passModel.aggregate([
        {
          $lookup:
            {
              from: "passwordcategories",
              localField: "passwordCategory",
              foreignField: "passwordCategory",
              as: "password_category "
            }
       }
    ]).exec(function(err,data) {
        if(err) throw err;
        res.send(data);
    });
    
});


module.exports = router;