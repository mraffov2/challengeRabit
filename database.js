const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/challenge', {
	useNewUrlParser: true
})
	.then(db => console.log(`Conection to database is succesfuly`))
	.catch(err => console.log(err));