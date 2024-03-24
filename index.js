require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

var urls = []
var id = 1;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.use(express.urlencoded({extended: false}));

app.post("/api/shorturl", (req, res) => {
    let url = req.body.url;    
    try {
        url = new URL(url).hostname.replace('www.', '');
    } catch (e) {
        res.json({
            error: "Invalid URL"
        });
        return;
    }
    dns.lookup(url, (err, addr, family) => {
        urls[id] = req.body.url;
        res.json({
            error: err ? "Invalid URL" : undefined,
            original_url: !addr ? undefined : req.body.url,
            short_url: !addr ? undefined : id++
        });
    });
})

app.get('/api/shorturl/:original_url', (req, res) => {
    let id = Number(req.params.original_url);
    if (urls[id] === undefined) {
        res.json({
            error: "No short URL found for the given input",
        });
        return;
    }
    res.redirect(urls[id])
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});