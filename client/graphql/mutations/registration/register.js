import gql from "graphql-tag";

export const REQUEST_REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(
      input: { username: $username, email: $email, password: $password }
    ) {
      jwt
      user {
        id
        username
        email
        role {
          name
          type
          description
        }
      }
    }
  }
`;
