const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const express = require("express");
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {

  res.send('Hello World!')
})

app.listen(4000);
console.log('Running at http://localhost:4000');