const express = require('express');
const multer  = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const employeeModel = require('../../modules/employeeModel');
const uploadModel = require('../../modules/uploadModel');
const app = express();
const router = express.Router();
//router.use('/',express.static('public'))

const Storage = multer.diskStorage({ 
    destination: './public/uploads/',
    filename: (req,file,cb) => {
        console.log(file.fieldname);
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    } 
});

const upload = multer({
    storage: Storage
}).single('uploadFile');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

function checkLogin(req,res,next) {
    try {
        jwt.verify( localStorage.getItem('loginToken'), 'loginToken');
    } catch(err) {
        res.send("you need to login to success this page");
    }
    next()
}

const employee = employeeModel.find();
const imageData = uploadModel.find();

/* Get Home Page */
router.get('/', checkLogin, function(req,res,next) {
    employee.exec(function(err,data) {
        //console.log(data);
        if(err) throw err;
        res.render('employee.html.twig', {
            title: "Employee Records",
            records: data,
            msg: {success:'', error:''}
        });
    })
    
});

router.post('/', function(req,res,next) {
    //console.log(req);
    var empDetails = new employeeModel({
        name: req.body.name,
        email: req.body.email,
        etype: req.body.etype,
        hourlyrate: req.body.hourRate,
        totalHour: req.body.totalHour,
        total: parseInt(req.body.hourRate) * parseInt(req.body.totalHour)
    });

    //console.log(empDetails)
    empDetails.save(function(err,res1) {
        if(err) throw err;
        employee.exec(function(err,data) {
            //console.log(data);
            if(err) throw err;
            res.render('employee.html.twig', {
                title: "Employee Records",
                records: data,
                msg: {success: 'Record Inserted Successfully', error:''}
            });
        })
    });

    
    
});

router.post('/search', function(req,res,next) {
    //console.log(req);
    var filterName = req.body.filterName;
    var filterEmail = req.body.filterEmail;
    var filterType = req.body.filterType;

    if(filterName != '' && filterEmail != '' && filterType != '') {
        var filterPram = {
            $and: [
                {name: filterName},
                {$and: [
                    {email: filterEmail},
                    {etype: filterType}
                ]}
            ]
        }
    } else if(filterName != '' && filterEmail == '' && filterType != '') {
        var filterPram = {
            $and : [
                {name: filterName},{etype: filterType}
            ]
        }
    } else if(filterName == '' && filterEmail != '' && filterType != '') {
        var filterPram = {
            $and: [
                {name: filterEmail},{etype: filterType}
            ]
        }
    } else if(filterName != '' && filterEmail != '' && filterType == '') {
        var filterPram = {
            $and: [
                {name: filterName},{etype: filterEmail}
            ]
        }
    } else if(filterName == '' && filterEmail == '' && filterType != '') {
        var filterPram = {etype: filterType}
    } else {
        var filterPram = {}
    }

    var employeeFilter = employeeModel.find(filterPram);

    // console.log(filterName)
    // console.log(filterEmail)
    // console.log(filterType)
    //console.log(filterPram)

    employeeFilter.exec(function(err,data) {
        //console.log(data);
        if(err) throw err;
        res.render('employee.html.twig', {
            title: "Employee Records",
            records: data
        });
    })
   
});

router.get('/edit/:id', function(req,res,next) {
    var id = req.params.id;
    var edit = employeeModel.findById(id);
    edit.exec(function(err,data) {
        console.log(data);
        if(err) throw err;
        res.render('edit_employee.html.twig', {
            title: "Edit Employee Records",
            records: data,
        });
        
    })
    
});

router.post('/update', function(req,res,next) {
    var update = employeeModel.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        email: req.body.email,
        etype: req.body.etype,
        hourlyrate: req.body.hourRate,
        totalHour: req.body.totalHour,
        total: parseInt(req.body.hourRate) * parseInt(req.body.totalHour)
    });
    update.exec(function(err,data) {
        console.log(data);
        if(err) throw err;
        employee.exec(function(err,data) {
            //console.log(data);
            if(err) throw err;
            res.render('employee.html.twig', {
                title: "Employee Records",
                records: data,
                msg: {success:'Record Updated Successfully', error:''}
            });
        })
        
    })
    
});

router.get('/delete/:id', function(req,res,next) {
    var id = req.params.id;
    var del = employeeModel.findByIdAndDelete(id);
    del.exec(function(err) {
        //console.log(data);
        if(err) throw err;
        employee.exec(function(err,data) {
            //console.log(data);
            if(err) throw err;
            res.render('employee.html.twig', {
                title: "Employee Records",
                records: data,
                msg: {success:'Record Deleted Successfully', error:''}
            });
        })
    })
    
});

router.get('/upload', function(req,res,next) {
    imageData.exec(function(err,data) {
        //console.log(data)
        if(err) throw err;
        res.render('upload_file.html.twig', {
            title: "Upload File",
            records: data,
            msg: {success: '', error: ''}
        });
    });
    
});

router.post('/upload', upload, function(req,res,next) {
    try {
        var imageFile = req.file.filename;
        var success = req.file.originalname + " upload successfully";
        var imageDetail = new uploadModel({
            imagename: imageFile
        });

        imageDetail.save(function(err,doc){
            if(err) throw err;
            imageData.exec(function(err,data) {
                if(err) throw err;
                //console.log(data)
                res.render('upload_file.html.twig', {
                    title: "Upload File",
                    records: data,
                    msg: {success: success, error: ''}
                });
            });
            
        });
    } catch (e) {
        imageData.exec(function(err,data) {
            if(err) throw err;
            //console.log(data)
            res.render('upload_file.html.twig', {
                title: "Upload File",
                records: data,
                msg: {success: "", error: "Please, choose upload file"}
            });
        });
    }
        
    
});

router.get('/login', function(req,res,next) {
    var token = jwt.sign({ foo: 'bar' }, 'loginToken');
    localStorage.setItem('loginToken', token);
    console.log(localStorage.getItem('loginToken'));
    res.send("Login Successfully")
});

router.get('/logout', function(req,res,next) {
    localStorage.removeItem('loginToken');
    res.send("Logout Successfully")
});



module.exports = router;