const express          = require('express'),
      app              = express(),
      bodyParser       = require('body-parser'),
      mongoose         = require('mongoose'),
      methodOverride   = require('method-override'),
      expressSanitizer = require('express-sanitizer');

app.set('view engine', 'ejs');      
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/birthday-app', {useNewUrlParser: true});

app.get('/', (req, res) => res.redirect('/birthdays'));

// INDEX route
app.get('/birthdays', (req, res) => res.render('index'));

// NEW route
app.get('/birthdays/new', (req, res) => res.render('new'));

// CREATE route
app.post('/birthdays', (req, res) => res.redirect('/birthdays'));

app.listen(3000, () => console.log('The server has started.'));