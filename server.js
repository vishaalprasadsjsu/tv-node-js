const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('index', {tv_summary: null, error: null})
})

app.post('/', function (req, res) {
  console.log(req.body.tv_show);

  let url = `http://api.tvmaze.com/search/shows?q=${req.body.tv_show}`
  request(url, function (err, response, body) {
      if(err) {
        res.render('index', {tv_summary: null, error: 'Error, please try again'});
      } else {
      let result = JSON.parse(body)
      if(result == undefined) {
        res.render('index', {tv_summary: null, error: 'Error, please try again'});

      } else {
        try { 
          let tv_summary_res = `<h2>${result[0].show.name}</h2>\n
            ${result[0].show.summary}`;
          res.render('index', {tv_summary: tv_summary_res, error: null});
        } catch (err) {
          res.render('index', {tv_summary: null, error: 'Error, please try again'});
        }
      }
      }
  });
})

app.listen(process.env.PORT || 3000, function () {
  console.log('PORT 3000 - listening')
})
