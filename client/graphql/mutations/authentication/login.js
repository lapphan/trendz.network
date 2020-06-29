import gql from 'graphql-tag'

export const REQUEST_LOGIN = gql`
mutation login($identifier: String!, $password: String!){
    login(input:{identifier: $identifier, password: $password}){
      jwt,
      user{
        id,
        username,
        email,
        role{
          name,
          type,
          description,
        }
      }
    }
  }
`