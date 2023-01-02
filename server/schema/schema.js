//const { projects, clients} = require('../sampleData.js')

const Project = require('../models/Project');
const Client = require('../models/Client');

const { GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType } = require('graphql');



//Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        //establishes a relationship between two data entities
        client: {
            type: ClientType,
            resolve(parent, args) {
                //mongoDB below
                return Client.findById(parent.clientId)  //clientID in the project model
            }
        }
    })
});


//Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});


//QUERIES
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({

        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
            }
        },


        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
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
            resolve(parent, args) {
                const client = new Client({
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
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
               Project.find({clientId: args.id}).then((projects) => {
                projects.forEach(project => {
                    project.remove();
                })
               })

                return Client.findByIdAndRemove(args.id)
            }
        },

        //Add a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType(
                        {
                            name: 'ProjectStatus',
                            values: {
                                'new': { value: 'Not Started' },
                                'progress': { value: 'In Progress' },
                                'completed': { value: 'Completed' },
                            }
                        }),
                    defaultValue: 'Not Started'
                }, //status
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },//args
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });

                return project.save();
            }  //resolve
        },//addProject

        //delete project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id)
            }
        },

        //update a project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType(
                        {
                            name: 'ProjectStatusUpdate',
                            values: {
                                'new': { value: 'Not Started' },
                                'progress': { value: 'In Progress' },
                                'completed': { value: 'Completed' },
                            }
                        }),
                }, //status
            }, //args
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {  //set = patch
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        }
                    },
                    { new: true } //flag: true = it will create a new project if not exists
                );
            }  //resolve
        },


    }, //feilds
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})