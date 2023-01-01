const { projects, clients} = require('../sampleData.js')

const {GraphQLObjectType,
       GraphQLID,
       GraphQLString,
       GraphQLInt,
       GraphQLFloat,
       GraphQLSchema,
       GraphQLList} = require('graphql');

//Client Type
const ClientType = new GraphQLObjectType({
    name:'Client',
    fields: () => ({
        id: {type:GraphQLID},
        name: {type:GraphQLString},
        email: {type:GraphQLString},
        phone: {type:GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields:() => ({
      client: {
        type: ClientType,
        args: {id:{type: GraphQLID}},
        resolve(parent,args) {
            return clients.find(client => client.id === args.id)
        }
      },
      clients: {
        type:new GraphQLList(ClientType),
        resolve(parent,args) {
            return clients;
        }
      }
   })
});

module.exports = new GraphQLSchema({
    query:RootQuery
})