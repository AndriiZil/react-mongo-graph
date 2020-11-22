const express = require('express');
const graphQlHttp = require('express-graphql');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlRootResolver = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use('/graphql',
  graphQlHttp({
  schema: graphQlSchema,
  rootValue: graphQlRootResolver,
  graphiql: true
}));

mongoose.connect('mongodb+srv://adnrii:mongol852@cluster0-zxmde.mongodb.net/events-react-dev?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(8000);
}).catch(err => {
  console.log(err);
});