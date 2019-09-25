const express = require('express')

const app = express();

app.set('port', process.env.PORT || 4000);
require('./database');

// routes
app.use('/api', require('./new_task'));

// start the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});