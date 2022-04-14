const express = require('express');
const router = express.Router();
const modelUser = require('../models/models');
const bcrypt = require('bcrypt');

const ifNotLogin = (req , res, next) => {
    if(!req.session.login){
        return res.render('login',{
            errMsg: '',
            successMsg: ''
        });
    }
    next();
}

router.get('/' , ifNotLogin , (req , res) => {
    res.render('index' , {
        fname: req.session.fname,
        lname: req.session.lname
    })
});

router.get('/register' , (req , res) => {
    res.render('register' , {
        errMsg: ''
    });
});

router.post('/register' , (req , res) => {
    const {fname , lname , username , password} = req.body;
    if(fname.length === 0){
        res.render('register' , {
            errMsg: 'Firstname is required'
        });
    }else if(lname.length === 0){
        res.render('register' , {
            errMsg: 'Lastname is required'
        });
    }else if(username.length === 0){
        res.render('register' , {
            errMsg: 'Username is required'
        });
    }else if(password.length === 0){
        res.render('register' , {
            errMsg: 'Password is required'
        });
    }else{
        modelUser.find({username: username}).exec((err , rows) => {
            if(err){
                throw err;
            }else{
                if(rows.length > 0){
                    res.render('register' , {
                        errMsg: 'Username is already exist'
                    });
                }else{
                    bcrypt.hash(password , 12 , (err , passwordHash) => {
                        if(err){
                            throw err;
                        }else{
                            let data = new modelUser({
                                fname: fname,
                                lname: lname,
                                username: username,
                                password: passwordHash  
                            });
                            modelUser.insertMany(data , err => {
                                if(err){
                                    throw err;
                                }else{
                                    res.render('login' , {
                                        errMsg: '',
                                        successMsg: 'Your account is created successfully'
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
});

router.post('/login' , (req , res) => {
    const {username , password} = req.body;
    if(username.length === 0){
        res.render('login' , {
            errMsg: 'Username is required',
            successMsg: ''
        });
    }else if(password.length === 0){
        res.render('login' , {
            errMsg: 'Password is required',
            successMsg: ''
        });
    }else{
        modelUser.find({username: username}).exec((err , rows) => {
            if(err){
                throw err;
            }else{
                if(rows.length > 0){
                    bcrypt.compare(password , rows[0].password , (err , result) => {
                        if(err){
                            throw err;
                        }else{
                            if(result === true){
                                req.session.login = true;
                                req.session.fname = rows[0].fname;
                                req.session.lname = rows[0].lname;
                                res.redirect('/');
                            }else{
                                res.render('login' , {
                                    errMsg: 'Invalid is password',
                                    successMsg: ''
                                });
                            }
                        }
                    });
                }else{
                    res.render('login' , {
                        errMsg: 'Invalid is username',
                        successMsg: ''
                    });
                }
            }
        });
    }
});

router.get('/logout' , (req , res) => {
    req.session = null;
    res.redirect('/');
});

module.exports = router;