var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');
var agis = require('./api.js');

let master = {
    'camden': null,
    'newBrunswick': null,
    'newark': null,
};

(async () => {
    try {
        master['newBrunswick'] = await agis.fetchNewBrunswick();
    } catch (e) {
        // handle e
    }
})();

const locationType = new graphql.GraphQLObjectType({
    name: 'Location',
    fields: {
      lat: { type: graphql.GraphQLString },
      lng: { type: graphql.GraphQLString },
    }
  })

const buildingType = new graphql.GraphQLObjectType({
    name: 'Building',
    fields: {
      buildingNumber: { type: graphql.GraphQLString },
      buildingName: { type: graphql.GraphQLString },
      buildingCenter: { type: locationType },
      buildingPolygons: { type: graphql.GraphQLList(graphql.GraphQLList(locationType))}
    }
  })


var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    buildings: {
        type: new graphql.GraphQLList(buildingType),
      args: {
        campus: { type: graphql.GraphQLString }
      },
      resolve: (_, { campus }) => {
        console.log(master);
        return master[campus];
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});

var app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(8080);

console.log('Listening on: localhost:8080/graphql');