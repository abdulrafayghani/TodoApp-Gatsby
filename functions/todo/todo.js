const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb"),
  q = faunadb.query
require("dotenv").config()

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
    discardTodo(id: String!): Todo
  }
`

const resolvers = {
  Query: {
    allTodos: async () => {
      try {
        const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })

        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("all_todos"))),
            q.Lambda(x => q.Get(x))
          )
        )

        return result.data.map(d => {
          return {
            todo: d.data.todo,
            id: d.ref.id,
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
  },
  Mutation: {
    addTodo: async (_, { todo }) => {
      console.log(todo)
      try {
        const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })

        const result = await client.query(
          q.Create(q.Collection("todos"), {
            data: {
              todo,
            },
          })
        )
        console.log(result)
        return result.data
      } catch (err) {
        console.log(err)
      }
    },
    discardTodo: async (_, { id }) => {
      console.log(id)
      const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })

      const result = await client.query(q.Delete(q.Ref(q.Collection), id))
      console.log(result)
    },
  },
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
