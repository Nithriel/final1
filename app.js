const express = require('express');
const hbs = require('hbs');
var app = express();
const fs = require('fs');

const port = process.env.PORT || 8080;

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('message', (text) => {
    return text.toUpperCase()
});

// app.use((request, response, next) => {
//     response.render('maintenance.hbs', {
//         title: 'Maintenance Page',
//         header: 'The site is currently down for a maintenance'
//     });
// });

app.get('/', (request, response) => {
    response.send({
        name: 'Raphael Pletz',
        school: [
            'BCIT',
            'SFU',
            'UBC'
        ]
    })
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

app.get('/info',(request, response) => {
    response.render('about.hbs', {
        title: 'Main Page'
    })
});

app.get('/404', (request, response) => {
    response.send({error: 'Page not found'})
});


app.listen(port, () => {
    console.log('Server is up on the port 8080')
});

