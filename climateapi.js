const axios = require('axios');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const pug = require('pug');
const mongoose = require('mongoose');
const http = require('http');
const { times } = require('lodash');
const cors = require("cors");


// Meteo Climate Change API
const app = express();
app.use(cors({ origin: true }));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get('/api', function (req, res){
// Entire Thingy
axios.get('https://climate-api.open-meteo.com/v1/climate?latitude=52.52&longitude=13.41&start_date=1950-01-01&end_date=2050-12-31&daily=temperature_2m_mean,temperature_2m_max,temperature_2m_min&models=MPI_ESM1_2_XR&min=1950-01-01&max=2050-12-31').then((response) => {
  var time= JSON.stringify(response.data.daily.time)
  var temperature_min= JSON.stringify(response.data.daily.temperature_2m_min)
  var temperature_max= JSON.stringify(response.data.daily.temperature_2m_max)
  var temperature_mean= JSON.stringify(response.data.daily.temperature_2m_mean)
  console.log(temperature_mean)
  res.render('chart',{time:times, temperature_min:temperature_min, temperature_max:temperature_max, temperature_mean:temperature_mean})
});

})

app.listen(3001, () => {
    console.log('App listening on port 3001!');
}); 