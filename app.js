const express = require('express')
const cors = require('cors');

const app = express();

app.set('port', process.env.PORT || 4000);
require('./database');

app.use(cors());

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// routes
app.use('/api', require('./new_task'));

// start the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});