const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const express = require("express");
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const generateFibonacciSequence = ({ count = 10 }) => {
  const initialSequence = [0, 1];
  const countTemplate = new Array(count - initialSequence.length).fill(null);

  const initialTemplate = [...initialSequence, ...countTemplate]
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

  return generatedFibonacciSequence;
}

app.get('/', (req, res) => {
  const count = 10;
  const generatedFibonacci = generateFibonacciSequence({ count });

  res.send('Hello World!')
})

app.listen(4000);
console.log('Running at http://localhost:4000');