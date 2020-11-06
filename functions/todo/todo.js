const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query
require('dotenv').config()

const typeDefs = gql`
  type Query {
      allTodos: [Todo!]
  }

  type Todo {
    todo: String
    id: String
  }

  type Mutation {
    addTodo(todo: String!): Todo
    discardTodo(id: String): Todo
  }
`

const resolvers = {
  Query: {
    allTodo: async () => {
      try {
        const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })

        const result = await client.query(
          q.Map(q.Paginate(q.Match(q.Index("all_todos"))),
            q.Lambda(x => q.Get(x))
          )
        )

        return result.data.map(d => {
          return{
            todo: d.data.todo,
            id: d.ref.id
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
  },
  Mutation: {
    addTodo: async (_, { todo }) => {
      try {
        const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })

        const result = await client.query(
          q.Create(q.Collection("todos"), {
            data: {
              title: todo
            }
          })
        )
        
        return result.data
    } catch (err) {
      console.log(err)
    }
    },
  deleteTodo: async (_, { id }) => {  
    const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })

    const result = await client.query(
      q.Delete(q.Ref(q.Collection), id)        
    )
  }
}
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
