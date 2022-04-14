const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const router = require('./routes/routes');
const app = express();

app.use(express.urlencoded({extended:false}));
app.set('views' , path.join(__dirname , 'views'));
app.set('view engine' , 'ejs');

app.use(cookieSession({
    name: 'session',
    keys: ['key1' , 'key2'],
    maxAge: 3600 * 1000
}));
    
app.use(router);

app.listen(3000 , () => {
    console.log('Start Server...');
});