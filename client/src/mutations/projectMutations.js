import { gql} from '@apollo/client';

//ProjectStatus comes from the schema in your service
const ADD_PROJECT = gql`
  mutation AddProject(
    $name: String!
    $description: String!
    $status: ProjectStatus!
    $clientId: ID!
  ) {
    addProject(
      name: $name
      description: $description
      status: $status
      clientId: $clientId
    ) {
      id
      name
      description
      status
      client {
        id
        name
        email
        phone
      }
    }
  }
`;


const DELETE_PROJECT = gql`
mutation DeleteProject($id:ID!) {
  deleteProject(id: $id) {
    id
  }
}
`;

//ProjectStatusUpdate comes from the schema in your service
const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String!
    $description: String!
    $status: ProjectStatusUpdate!  
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
    ) {
      id
      name
      description
      status
      client {
        id
        name
        email
        phone
      }
    }
  }
`;

export {ADD_PROJECT,DELETE_PROJECT,UPDATE_PROJECT};