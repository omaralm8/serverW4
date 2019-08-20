let express = require ('express');
let app = express();
let router = require('./routerW4.js');

app.use('/',router);
app.listen(8080);


