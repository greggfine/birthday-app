const express          = require('express'),
      app              = express(),
      bodyParser       = require('body-parser'),
      mongoose         = require('mongoose'),
      methodOverride   = require('method-override'),
      expressSanitizer = require('express-sanitizer');

app.set('view engine', 'ejs');      
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// ======================================================================================
mongoose.connect('mongodb://localhost:27017/birthday-app', {useNewUrlParser: true});

// mongoose Schema and Model

var birthdaySchema = new mongoose.Schema({
    name: String,
    birthday: String,
    age: Number,
    giftIdeas: String,
    imageURL: String
});

var Birthday = mongoose.model("Birthday", birthdaySchema);

// Birthday.create({
//   name: "Arnold Fine",
//   birthday: "September 16th",
//   age: 80,
//   giftIdeas: "gift card",
//   imageURL:
//     "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Father_on_father%27s_day.jpg/1200px-Father_on_father%27s_day.jpg"
// });

// ======================================================================================

app.get('/', (req, res) => res.redirect('/birthdays'));

// INDEX route
app.get('/birthdays', (req, res) => {
    Birthday.find({}, (err, result) => {
        if(err) console.log(err);
        else {
            res.render('index', {birthdays: result});
        }
    })
});

// NEW route
app.get('/birthdays/new', (req, res) => res.render('new'));

// CREATE route
app.post('/birthdays', (req, res) => {
    req.body.birthday.giftIdeas = req.sanitize(req.body.birthday.giftIdeas);
    Birthday.create(req.body.birthday, (err, result) => {
        if(err) {
            throw new Error('invalid entry', err)
        }
        else {
            res.redirect('/birthdays')
        }
    })
});

// SHOW route
app.get('/birthdays/:id', (req, res) => {
    Birthday.findById(req.params.id, (err, result) => {
        if(err) throw err;
        else {
            res.render('show', {birthday: result})
        }
    })
})

// EDIT route
app.get('/birthdays/:id/edit', (req, res) => {
    Birthday.findById(req.params.id, (err, result) => {
        if(err) throw err;
        else {
            res.render('edit', {birthday: result})
        }
    })
})

// UPDATE route
app.put('/birthdays/:id', (req, res) => {
    req.body.birthday.giftIdeas = req.sanitize(req.body.birthday.giftIdeas);
    Birthday.findByIdAndUpdate(req.params.id, req.body.birthday, (err, result) => {
        if(err) throw err;
        else {
            res.redirect(`/birthdays/${req.params.id}`)
        }
    })
})

// DELETE route
app.delete('/birthdays/:id', (req, res) => {
    Birthday.findByIdAndRemove(req.params.id, (err, result) => {
        if(err) throw err;
        else {
            res.redirect('/birthdays');
        }
    })
})




// ======================================================================================

app.listen(3000, () => console.log('The server has started.'));