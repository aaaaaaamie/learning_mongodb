var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));


MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function (req, res, next) {
        res.render('imdb_enter_form', {'fields': ['title', 'year', 'imdb']});
    });

    app.post('/add_movie', function (req, res, next) {
        var title = req.body.title,
            imdb = req.body.imdb,
            year = req.body.year;

        db.collection('movies').insertOne({'title': title, 'year': year, 'imdb': imdb});
        db.collection('movies').find({}).toArray(function(err, data) {
            console.log(data);
            res.render('imdb_entry', {'entries': data});
        });
    });

    // app.get('/', function(req, res){

    //     db.collection('movies').find({}).toArray(function(err, docs) {
    //         res.render('movies', { 'movies': docs } );
    //     });

    // });

    app.use(function(req, res){
        res.sendStatus(404);
    });

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});




