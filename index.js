const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs');
var request = require('request');
require('dotenv').config();
const util= require('util');
const unlinkFile= util.promisify(fs.unlink);
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const { auth, requiresAuth } = require('express-openid-connect');
const methodOverride= require("method-override")
const favicon= require('serve-favicon');
const path= require('path');
const { log } = require("console");
const axios = require('axios');
const { range } = require("lodash");
//work begins here
const { Configuration, OpenAIApi } = require("openai");
const { error } = require("firebase-functions/lib/logger");
const cors = require("cors");


const port=  3005;
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));


/*
const config = new Configuration({
	apiKey: "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",
});

const openai = new OpenAIApi(config);

// Generating Facts
const runPrompt = async () => {
	const prompt = `
        write me a joke about a cat and a bowl of pasta. Return response in the following parsable JSON format:

        {
            "Q": "question",
            "A": "answer"
        }

    `;

	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 2048,
		temperature: 1,
	});

	const parsableJSONresponse = response.data.choices[0].text;
	const parsedResponse = JSON.parse(parsableJSONresponse);

	console.log("Question: ", parsedResponse.Q);
	console.log("Answer: ", parsedResponse.A);
};

runPrompt();

// Generating Imagesw
const prompt = "A sketch of a cat playing basketball";
const numberOfImages = 1;
const imageSize = "1024x1024";

openai
	.createImage({
		prompt: prompt,                                                                                    
		n: numberOfImages,
		size: imageSize,
	})
	.then((data) => {
		console.log(data.data.data);
	});
*/
app.get('/', function(req,res){
  res.render("home")
})
app.get('/orgs', function(req,res){
  res.render("orgs")
})
app.get('/news', async function(req,res){
  // Fetching all the articles with all the details
  const options = {
    method: 'GET',
    url: 'https://climate-news-feed.p.rapidapi.com/',
    params: {
      // empty
    },
    headers: {
      'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
      'X-RapidAPI-Host': 'climate-news-feed.p.rapidapi.com'
    }
  };  
    try {
      const options2 = {
        method: 'GET',
        url: 'https://climate-news-feed.p.rapidapi.com/page/1',
        headers: {
          'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
          'X-RapidAPI-Host': 'climate-news-feed.p.rapidapi.com'
        }
      };
      // Fetching the total number of Articles
      try {
        const response = await axios.request(options2);
        var totalArticles=response.data.meta.totalArticles;
      } catch (error) {
        console.error(error);
      }
      const response = await axios.request(options);
        var news= response.data.articles;
        var datas= [];
        for (var index = 0; index < totalArticles; index++) {
        datas.push(news[index])
        }
        console.log(datas[3]);
        res.render("news",{datas:datas})
    } catch( error) {
        res.send(error);
    }
})


app.get('/footprint',  async function(req, res){
  if(req.query.O3 && req.query.NO2 && req.query.PM) {
    // const O3 = new RegExp(escapeRegex(req.query.O3), 'gi');
    // const O3second=  new RegExp(spaceReplace(req.query.O3second));
    // const NO2 = new RegExp(escapeRegex(req.query.NO2), 'gi');
    // const NO2second=  new RegExp(spaceReplace(req.query.NO2second));
    // const PM = new RegExp(escapeRegex(req.query.PM), 'gi');
    // const PMsecond=  new RegExp(spaceReplace(req.query.PMsecond));

    const options3 = {
      method: 'GET',
      url: 'https://carbonfootprint1.p.rapidapi.com/AirQualityHealthIndex',
      params: {
        O3:req.query.O3 ,
        NO2: req.query.NO2,
        PM: req.query.PM
      },
      headers: {
        'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
        'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'
      }
    }
   
    try {
      const response1 = await axios.request(options3);
      console.log(response1.data);
      var airQualityHealthIndex= response1.data.airQualityHealthIndex;
      res.render("carbon",{airQualityHealthIndex:airQualityHealthIndex})
    }catch (error) {
      console.error(error);
    }}else{
      res.render("carbon",{airQualityHealthIndex:airQualityHealthIndex})
    }
  })

  app.get('/footprint/paper', async function (req, res){
    if (req.query.weight && req.query.unit) {
      
  
    const options = {
      method: 'GET',
      url: 'https://carbonfootprint1.p.rapidapi.com/TreeEquivalent',
      params: {
        weight: req.query.weight,
        unit: req.query.unit
         },
      headers: {
        'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
        'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data.numberOfTrees);
      var numberOfTrees=response.data.numberOfTrees
      res.render("paper",{numberOfTrees:numberOfTrees})
    } catch (error) {
      console.error(error);
    }  }
  else{
      res.render("paper",{numberOfTrees:numberOfTrees})
    }
  });
  

app.get('/footprint/clean', async function(req, res){
  if (req.query.energy && req.query.consumption) {
    const energy = req.query.energy
    // const energy=  new RegExp(spaceReplace(energyraw));
    var consumption= req.query.consumption;
const options = {
  method: 'GET',
  url: 'https://carbonfootprint1.p.rapidapi.com/CleanHydroToCarbonFootprint',
  params: {
    energy: energy,
    consumption: consumption
  },
  headers: {
    'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
    'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
  var carbonEquivalent=response.data.carbonEquivalent
  res.render('clean',{carbonEquivalent:carbonEquivalent})
} catch (error) {
	console.error(error);
} }else{
  res.render('clean',{carbonEquivalent:carbonEquivalent})
}
 
})

app.get('/footprint/fuel', async function(req, res){
  if (req.query.type && req.query.liters) {
    const type = req.query.type
    // const energy=  new RegExp(spaceReplace(energyraw));
    var liters= req.query.liters;
    const options = {
      method: 'GET',
      url: 'https://carbonfootprint1.p.rapidapi.com/FuelToCO2e',
      params: {
        type: type,
        litres: liters
      },
      headers: {
        'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
        'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
      var carbonEquivalent= response.data.carbonEquivalent
      res.render('fuel',{carbonEquivalent: carbonEquivalent})
    } catch (error) {
      console.error(error);
    } }else{
  res.render('fuel',{carbonEquivalent:carbonEquivalent})
}
 
})

app.get('/footprint/car', async function(req, res){
  if (req.query.distance && req.query.vehicle) {
    const distance = req.query.distance
    // const energy=  new RegExp(spaceReplace(energyraw));
    var vehicle= req.query.vehicle;
    const options = {
      method: 'GET',
      url: 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromCarTravel',
      params: {
        distance: distance,
        vehicle: vehicle
      },
      headers: {
        'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
        'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
      var carbonEquivalent= response.data.carbonEquivalent
      res.render('car',{carbonEquivalent:carbonEquivalent})
    } catch (error) {
      console.error(error);
    } }else{
  res.render('car',{carbonEquivalent:carbonEquivalent})
}
})

app.get('/footprint/flight', async function(req, res){
  if (req.query.distance && req.query.type) {
    const distance = req.query.distance
    // const energy=  new RegExp(spaceReplace(energyraw));
    var type= req.query.type;
    const options = {
      method: 'GET',
      url: 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromFlight',
      params: {
        distance: distance,
        type: type
      },
      headers: {
        'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
        'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      var carbonEquivalent= response.data.carbonEquivalent;
      res.render('flight',{carbonEquivalent:carbonEquivalent})
    } catch (error) {
      console.error(error);
    } }else{
  res.render('flight',{carbonEquivalent:carbonEquivalent})
}
})



app.get('/footprint/bike', async function(req, res){
  if (req.query.type && req.query.distance) {
    const distance = req.query.distance
    // const energy=  new RegExp(spaceReplace(energyraw));
    var type= req.query.type;
    const options = {
      method: 'GET',
      url: 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromMotorBike',
      params: {
        type: type,
        distance: distance
      },
      headers: {
        'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
        'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      var carbonEquivalent= response.data.carbonEquivalent;
      res.render('bike',{carbonEquivalent:carbonEquivalent})
    } catch (error) {
      console.error(error);
    } }else{
  res.render('bike',{carbonEquivalent:carbonEquivalent})
}
})

app.get('/footprint/transit', async function(req, res){
  if (req.query.type && req.query.distance) {
    const distance = req.query.distance
    // const energy=  new RegExp(spaceReplace(energyraw));
    var type= req.query.type;
    const options = {
      method: 'GET',
      url: 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromPublicTransit',
      params: {
        distance: distance,
        type: type
      },
      headers: {
        'X-RapidAPI-Key': 'aae55d79c0mshe3f425807cb2a6ep1b82a0jsnb5e979ddc835',
        'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      var carbonEquivalent= response.data.carbonEquivalent;
      res.render('transit',{carbonEquivalent:carbonEquivalent})
    } catch (error) {
      console.error(error);
    } }else{
  res.render('transit',{carbonEquivalent:carbonEquivalent})
}
})

// Jadui Functions
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
function spaceReplace(text) {
  return text.replace(/\s+/g, '%20');
}

app.listen(port, function() {
    console.log(`Server started sucessfully at ${port}`);
  });

  /*
OPEN AI Architecture

app.get('/', function (req,res) {
    const configuration = new Configuration({
        apiKey: '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',
      });
      const openai = new OpenAIApi(configuration);
      
        async () => {
        const prompt = `
            write me a joke about a cat and a bowl of pasta. Return response in the following parsable JSON format:
    
            {
                "Q": "question",
                "A": "answer"
            }
    
        `;
    
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 2048,
            temperature: 1,
        });
    
        const parsableJSONresponse = response.data.choices[0].text;
        const parsedResponse = JSON.parse(parsableJSONresponse);
    
        console.log(`Question: ${parsedResponse.Q} Answer: ${parsedResponse.A}`);
    };
    
  
});

  */
