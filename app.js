const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Add this line
const routes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Add this line to enable cookie parsing

app.use(routes);

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
