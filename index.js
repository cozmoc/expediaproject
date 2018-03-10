const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const parser = (obj) => {
  let str = [];
  for(let p in obj)
    if (obj.hasOwnProperty(p)) {
      if (encodeURIComponent(obj[p])) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  return str.length ? str.join("&") : '';
}

const baseURL = 'https://offersvc.expedia.com/offers/v2/getOffers?scenario=deal-finder&page=foo&uid=foo&productType=Hotel&';

app.post('/search', (req, res) => {
  const params = parser(req.body);
  request(baseURL + params, (error, response, body) => {
    if (!error) {
      res.send(body);
    }
  });
});


app.set('port', (process.env.PORT || 9000));

app.use(express.static(__dirname + '/client'));
app.set('views', __dirname + '/client');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.render('index.html')
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

