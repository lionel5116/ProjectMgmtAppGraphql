import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
//import Clients from "./components/Clients";
//import Projects from "./components/Projects";
//import AddClientModal from "./components/AddClientModal";
import Home from './pages/Home';
import NotFound from './pages/NotFound';

//the code below is for handling warnings when using cache to refresh
//works with the update code in ClientRow.jsx when you are using it
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});



const client = new ApolloClient(
  {
    uri: 'http://localhost:5800/graphql',
    cache: cache,
  }
);

//the path with * needs to always be the last element
function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <div className="container">
           <Routes>
             <Route path='/' element={<Home />}></Route>

             <Route path='*' element={<NotFound />}></Route>
           </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>

  );
}

export default App;
