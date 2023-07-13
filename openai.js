const { Configuration, OpenAIApi } = require("openai");
// const { error } = require("firebase-functions/lib/logger");
const { log } = require("console");
const axios = require('axios');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var IdD=[];


// Example directly sending a text string:


/*
 for (var index = 0; index < climateChangeFacts.length + 1; index++) {
  
var data = JSON.stringify({
  "model": "txt2img",
  "data": {
    "prompt": climateChangeFacts[index],
    "negprompt": climateChangeFacts[index],
    "samples": 1,
    "steps": 50,
    "aspect_ratio": "square",
    "guidance_scale": 7.5,
    "seed": 2414
  }
});

var config = {
  method: 'post',
  url: 'https://api.monsterapi.ai/apis/add-task',
  headers: { 
    'x-api-key': 'JNqFX5rago1Ah0KMNMtP44fqHKJr5ZCa72f5ylo3', 
    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTAyODcxMDMsImlhdCI6MTY4NzY5NTEwMywic3ViIjoiZWU4ZmNhNWI4MmQxMmZiNzFmMWQzYzU5YzdjZGU1NjkifQ.xZFPa-7LJ4diBr2e2KReO8iMWm4GL_i8MRlDywgABhs', 
    'Content-Type': 'application/json'
  },
  data : data
  
};
// {"process_id":"48342edd-1357-11ee-ba5d-f191948c4c97"}
axios(config)
.then(function (response) {
  // console.log(`{"process_id":${JSON.stringify(response.data.process_id)}}`);
  var IdDl= response.data.process_id
  IdD.push(IdDl)
  if (IdD.length == 10) {
  window.abc=  function(){return IdD}
  }
})
.catch(function (error) {
  console.log(error);
})

}

console.log(window.abc());
  // var data2='{\n    "process_id" :  "8c568745-135b-11ee-af17-555eacd8687d"\n}'

urls=[];
// for (let index = 0; index < IdD.length + 1; index++) {
  
 var data1 = `{"process_id":${IdD[1]}}`
 /* 
 var config = {
    method: 'post',
  maxBodyLength: Infinity,
    url: 'https://api.monsterapi.ai/apis/task-status',
    headers: { 
      'x-api-key': 'JNqFX5rago1Ah0KMNMtP44fqHKJr5ZCa72f5ylo3', 
      'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTAyODcxMDMsImlhdCI6MTY4NzY5NTEwMywic3ViIjoiZWU4ZmNhNWI4MmQxMmZiNzFmMWQzYzU5YzdjZGU1NjkifQ.xZFPa-7LJ4diBr2e2KReO8iMWm4GL_i8MRlDywgABhs'
    },
    data : data2
  };
  
  axios(config)
  .then(function (response) {
  
    //  if (response.data.status=="IN_PROGRESS") {
         // setTimeout(() => { console. log(JSON.stringify(response.data)); }, 50000);
         console. log(JSON.stringify(response.data))
         urls.push(response.data.response_data)
         if (urls.length ==10) {
          console.log(urls);
         }
    // }
  })
  .catch(function (error) {
    console.log(error);
  });
// } 

*/




const port=  3005;
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/facts',function(req,res){


// Generating Facts
const climateChangeFacts = [];
const urls=[];

const config = new Configuration({
  	apiKey: "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",
  });
  const openai = new OpenAIApi(config);

const runPrompt = async () => {

  for (let index = 0; index < 3; index++) {
 
	const prompt = `
  Get me exactly one fact related to climate change economics and inequality that will shock anyone.
  The fact must be less than or equal to 50 words long.
  Answer in the following format:
  [Fact1],
  [Fact2],
  ...
  [Fact50]
  `
  ;

	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 2048,
		temperature: 1,
	});

	const parsableJSONresponse = response.data.choices[0].text.split("\n")[1].split('Fact:');
	// const parsedResponse = JSON.parse(parsableJSONresponse);
  // console.log(parsableJSONresponse);
  climateChangeFacts.push(parsableJSONresponse);
}

const runPrompt2 = async () => {
  for (let index = 0; index < 3; index++) {
    const element = climateChangeFacts[index][0]
  const prompt2 =element;
  const numberOfImages = 1;
  const imageSize = "1024x1024";
  
  openai
    .createImage({
      prompt: prompt2,                                                                                    
      n: numberOfImages,
      size: imageSize,
    })
    .then((data) => {
      const oneURL=data.data.data[0].url;
      urls.push(oneURL)
      if (urls.length == 3) {
        res.render('facts',{urls:urls, climateChangeFacts:climateChangeFacts})
      }
    });
  }
  }
  runPrompt2()
};
runPrompt();
})

app.listen(3005, () => {
  console.log('App listening on port 3005!');
}); 
