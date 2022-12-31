const express = require('express');
require('dotenv').config();
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const port = process.env.PORT || 5800;

//https://www.youtube.com/watch?v=BcLNfwF04Kw

const app = express();

app.use('/graphql', graphqlHTTP( {
    schema,
    //graphiql: true
    graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(port, console.log(`Server running on port ${port}`));
