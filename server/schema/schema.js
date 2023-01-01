//const { projects, clients} = require('../sampleData.js')

const Project = require('../models/Project');
const Client = require('../models/Client');

const {GraphQLObjectType,
       GraphQLID,
       GraphQLString,
       GraphQLInt,
       GraphQLFloat,
       GraphQLSchema,
       GraphQLList,
       GraphQLNonNull} = require('graphql');

       

//Project Type
const ProjectType = new GraphQLObjectType({
    name:'Project',
    fields: () => ({
        id: {type:GraphQLID},
        name: {type:GraphQLString},
        description: {type:GraphQLString},
        status: {type:GraphQLString},
        //establishes a relationship between two data entities
        client: {
            type:ClientType,
            resolve(parent,args) {
                //return clients.find(client => client.id === parent.clientId)

                //mongoDB below
                return clients.findById(parent.clientId)  //clientID in the project model
            }
        }
    })
});


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


//QUERIES
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields:() => ({

    project: {
        type: ProjectType,
        args: {id:{type: GraphQLID}},
        resolve(parent,args) {
            //return projects.find(project => project.id === args.id)

            //mongoDB below
            return Project.findById(args.id);
        }
      },
      projects: {
        type:new GraphQLList(ProjectType),
        resolve(parent,args) {
            //return projects;

            //mongoDB below
            return Project.find();
        }
      },


      client: {
        type: ClientType,
        args: {id:{type: GraphQLID}},
        resolve(parent,args) {

            //return clients.find(client => client.id === args.id)

             //mongoDB below
             return Client.findById(args.id)
        }
      },
      clients: {
        type:new GraphQLList(ClientType),
        resolve(parent,args) {
            //return clients;

            //mongoDB below
            return Client.find();
        }
      }

   })  //fields:() => ({
});


//Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //add a client record
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent,args) {
                const client = new Client( {
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client.save();
            },
        },

        //Delete Client
        deleteClient: {
            type: ClientType,
            args: {
               id: { type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args) {
                return Client.findByIdAndRemove(args.id)
            }
        },

        

    }, //feilds
});

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
})