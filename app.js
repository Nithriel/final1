const express = require('express');
const hbs = require('hbs');
var app = express();
const fs = require('fs');
var bodyParser = require("body-parser");
const axios = require('axios');

const port = process.env.PORT || 8080;

hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});


app.use((request, response, next) => {
    var time = new Date().toString();
    var log = `${time}:${request.method} ${request.url}`;
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error) {
            console.log('Unable to log message');
        }
    });
    next()
});

app.get('/',(request, response) => {
    response.render('cards.hbs', {
        title: 'Cards API',
        header: 'Cards API',
    })
});

app.post('/displaycards', async (request, response) => {
    try {
        var number_cards = request.body.number_cards;
        var deck = await axios.get(`https://deckofcardsapi.com/api/deck/new/draw/?count=${number_cards}`);
        var count = deck.data.cards.length;
        console.log(count);
        var images = '';
        for(var i = 0; i < count; i++) {
            var item = deck.data.cards[i].image;
            images = images + '<img alt="deck" src=' + item + '>'
        }
        response.render('cards.hbs', {
            title: 'Cards API',
            header: 'Cards API',
            cards: images
        });

    } catch (e) {

    }
});


app.get('/nasa',(request, response) => {
    response.render('nasa.hbs', {
        title: 'NASA API',
        header: 'NASA API',
    })
});

app.post('/displaynasa', async (request, response) => {
    try {
        var images_to_search = request.body.image_to_search;
        var deck = await axios.get('https://images-api.nasa.gov/search?q=' + encodeURIComponent(images_to_search));
        var images = '';
        for(var i = 0; i < 4; i++) {
            var item = deck.data.collection.items[i].links[0].href;
            item = encodeURI(item);
            images = images + '<img height="250" width="250" alt="nasa" src=' + item + '>'
        }
        response.render('nasa.hbs', {
            title: 'NASA API',
            header: 'NASA API',
            images: images
        });

    } catch (e) {

    }
});


app.get('/404', (request, response) => {
    response.send({error: 'Page not found'})
});


app.listen(port, () => {
    console.log('Server is up on the port 8080')
});

