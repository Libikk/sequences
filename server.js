const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const express = require("express");
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const generateFibonacciSequence = ({ outputCount, start }) => {
  const startIndex = start - 1;
  const countTemplate = start + outputCount;
  const initialSequence = [0, 1];
  const outputCountTemplate = new Array(countTemplate - initialSequence.length).fill(null);

  const initialTemplate = [...initialSequence, ...outputCountTemplate]
  // [0, 1, null, null, null, null, null, null, null, null]

  const generatedFibonacciSequence = initialTemplate.map((currentValue, index, arr) => {
    const isIgnoreInitialValues = index < 2;
    if (isIgnoreInitialValues) return currentValue;

    const prevValueIndex = index - 1;
    const prevValue = arr[prevValueIndex];
    const prevOfPrevValueIndex = prevValueIndex - 1;
    const prevOfPrevValue = arr[prevOfPrevValueIndex];

    const newValue = prevValue + prevOfPrevValue;
    initialTemplate[index] = newValue;
    return newValue;
  })

  return generatedFibonacciSequence.slice(startIndex, outputCount + startIndex);
}

app.get('/fibonacci/create', (req, res) => {
  const { count, start } = req.query

  const generatedFibonacci = generateFibonacciSequence({
    outputCount: Number(count),
    start: Number(start)
  });

  res.send(generatedFibonacci).json();
})

app.listen(4000);
console.log('Running at http://localhost:4000');