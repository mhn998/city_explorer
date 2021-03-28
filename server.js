'use strict';
// Load the express module into our script
const express = require('express');
const cors = require('cors');

require('dotenv').config();

// App Setup:
const app = express(); //creating the server application
const PORT = process.env.PORT || 3000;

app.use(cors()); //will respond to any request and allow access to our api from another domain

/*
 req=> All information about the request the server received
 res=> methods which can be called to create and send a response to the client
 */

// API Routes:
app.get('/', (req, res) => {
    res.status(200).send('Ok!');
    console.log(req.query);
});

//Location route:
app.get('/location', handleLocation);

//Weather route:
app.get('/weather', handleWeather)

// Error
app.use('*', notFoundHandler);


// Location callback
function handleLocation(req, res) {
    try {
        const location = require('./data/location.json');
        const city = req.query.city;
        const locationInfo = new Location(city, location);
        res.status(200).send(locationInfo);

    } catch (error) {
        errorHandler(error, request, response);
    }

}

//location constructor:
function Location(city, location) {
    this.search_query = city;
    this.formatted_query = location[0].display_name;
    this.latitude = location[0].lat;
    this.longitude = location[0].lon;
}


// weather calllback
function handleWeather(req, res) {
    try {
        const weather = require('./data/weather.json');
        const weatherRender = [];
        weather.data.forEach(day => {
            let eachDayWeather = new Weather(day)
            weatherRender.push(eachDayWeather)
        })
        res.status(200).json(weatherRender);

    } catch (error) {
        errorHandler(error, request, response);
    }
};

//weather constructor:
function Weather(weather) {
    this.forecast = weather.weather.description;
    this.time = new Date(weather.valid_date).toDateString();
}


function errorHandler(error, req, res) {
    res.status(500).send(error);
}

function notFoundHandler(req, res) {
    res.status(404).send('HUH ?NOT FOUND!');
}

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});