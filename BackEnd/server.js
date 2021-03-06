var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoDB = 'mongodb://admin:hello123@ds219983.mlab.com:19983/posts';
var path = require('path');
const mongoose = require('mongoose');
mongoose.connect(mongoDB);


//Here we are configuring express to use body-parser as middle-ware. 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var Schema = mongoose.Schema;
//define schema
var postSchema = new Schema({
    title: String,
    content: String
})

var PostData = mongoose.model('PostData', postSchema);

app.use("/", express.static(path.join(__dirname, "angular")));

app.post('/api/posts', function (req, res) {
    console.log("post successful");
    console.log(req.body.title);
    console.log(req.body.content);

    PostData.create({
        title: req.body.title,
        content: req.body.content
    });
    console.log("Inserting item");

})

app.get('/api/posts', function (req, res) {
    PostData.find(function (err, posts) {
        if (err)
            res.send(err)
        res.json(posts);
    });
})

app.delete('/api/posts/:id', function(req,res){
    PostData.deleteOne({ _id: req.params.id }, 
        function (err) {});
})


app.get('/api/posts/:id', function(req,res){
        PostData.find({ _id: req.params.id},
            function (err, data) {
                if (err)
                    return handleError(err);
    
                res.json(data);

    });
});

app.put('/api/posts/:id', function(req,res){
    PostData.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
})

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, "angular", "index.html"));
})

app.get('/getposts/:title', function (req, res) {
    console.log("Get " + req.params.title + " Post");

    PostData.find({ 'title': req.params.title },
        function (err, data) {
            if (err)
                return handleError(err);

            res.json(data);
        });
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})