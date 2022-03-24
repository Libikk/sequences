const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const express = require("express");
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ONESEC = 1000
const EXPIRY_SECONDS = ONESEC * 10;
const CURRENT_DATE = new Date().getTime();


const store = {
  // extend store for counts
  sequences: [
    {
      idsequenceValue: [2, 3, 5, 8, 13],
      dateCreated: new Date('2022-03-24T11:39:44.124Z').getTime()
    }
  ]
}

const getExpiredSequences = () => {
  const isExpired = ({ dateCreated }) => CURRENT_DATE - dateCreated < EXPIRY_SECONDS;  // this method could be refactored to respect params: start / end
  return  store.sequences.filter(isExpired);
}

const removeSequences = (seqeuencesToRemove) => store.sequences = store.sequences.filter(({ dateCreated }) => {
  const isToRemove = seqeuencesToRemove.some(sequence => sequence.dateCreated === dateCreated);
  return !isToRemove;
})

const checkSequences = () => {
  const expiredSequences = getExpiredSequences();
  if (expiredSequences.length) {
    removeSequences(expiredSequences);
  }
}

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


setInterval(() => checkSequences(), ONESEC)


app.listen(4000);
console.log('Running at http://localhost:4000');