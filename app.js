var express = require('express'),
    app = express();

app.get('/', function(req, res){
    res.redirect('http://www.sisobrand.com:2345');
    res.status(200).sendFile('index.html');
});

app.get('*', function(req, res){
    res.status(404).send('Sorry, we cannot find that!');
});

app.listen(2345, "120.26.48.94");
console.log('Express server started at 120.26.48.94:2345');

