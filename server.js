let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let port = 8080;
let plot = require('./app/routes/plot');
let cors = require('cors');

app.use(cors({origin: '*'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));

app.route("/plot")
    .get(plot.getWolframPlot);

app.listen(port);