const express = require('express');
const cors = require('cors')
const db = require('./database');

const app = express()
app.use(cors())
app.options('*', cors());

app.get('/items', function (req, res) {
    db.getByMonth('june') 
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.err();
        })
});

app.listen(8080, function () {
    console.log('listening on port 8080!');
});
