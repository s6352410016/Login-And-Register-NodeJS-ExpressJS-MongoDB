const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/login-register-DB';

mongoose.connect(dbUrl , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => {
    if(err){
        throw err;
    }
});

let userSchema = mongoose.Schema({
    fname: String,
    lname: String,
    username: String,
    password: String
});

let modelUser = mongoose.model('user' , userSchema);

module.exports = modelUser;