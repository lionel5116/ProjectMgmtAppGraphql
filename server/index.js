const express = require('express');
const colors = require('colors');
require('dotenv').config();
const cors = require('cors')
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const connectDB = require('./config/db');
const port = process.env.PORT || 5800;

//https://www.youtube.com/watch?v=BcLNfwF04Kw
//http://localhost:5800/graphql

const app = express();

//connect to database
connectDB();

//add cors
app.use(cors()); //this fixes any cors errors


app.use('/graphql', graphqlHTTP( {
    schema,
    //graphiql: true
    graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(port, console.log(`Server running on port ${port}`));
