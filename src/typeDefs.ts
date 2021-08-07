import {gql} from "apollo-server-express";

export const typeDefs = gql`
    type User {
        id: ID
        _id: ID
        username: String
        givenName: String!
        familyName: String!
        email: String!
        token: String!
    }

    type Color {
        name: String!
        value: String!
        user: String!
    }

    type Design {
        name: String!
        colors: [String!]!
        shape: String!
        user: String!
    }

    type Post {
        message: String!
        selectedFile: String!
        user: String!
    }

    type AuthPayload {
        token: String
        user: User
    }

    type Query {
        getAllUsers: [User!]!
        getColors(userId: ID!): [Color!]!
        colorExists(hex: String!): Boolean
        getDesigns(userId: ID!): [Design!]!
        getPosts: [Post!]!
    }

    type Mutation {
        signUp(username: String!, givenName: String!, familyName: String!,
            email: String!, password: String!, confirmPassword: String!): AuthPayload
        signIn(email: String!, password: String!): AuthPayload
        uploadColor(name: String, hex: String!, userId: ID!): Color
        uploadDesign(userId: ID!, name: String!, colors: [String!]!): Design,
        uploadPost(userId: ID!, message: String!, selectedFile: String!): Post
    }
`