import {gql} from "apollo-server-express";

export const typeDefs = gql`
    type User {
        id: ID
        _id: ID
        username: String!
        givenName: String!
        familyName: String!
        email: String!
    }

    type Color {
        name: String!
        value: String!
        user: String!
    }
    
    type ColorPayload {
        color: Color!
        user: User!
    }

    type Design {
        name: String!
        colors: [String!]!
        shape: String!
        user: String!
    }
    
    type DesignPayload {
        design: Design!
        user: User!
    }

    type Post {
        message: String!
        selectedFile: String
        likes: [String]
    }

    type PostPayload {
        post: Post!
        user: User!
    }
    
    type PostsPayload {
        posts: [Post!]!
        user: User!
    }
    
    type AuthPayload {
        token: String
        user: User
    }

    type Query {
        me: User!
        getAllUsers: [User!]!
        getColors(userId: ID!): [Color!]!
        colorExists(hex: String!): Boolean
        getDesigns(userId: ID!): [Design!]!
        getPosts: [Post!]!
        getPost(id: ID!): PostPayload
        getPostsByCreator(id: ID!): PostsPayload
        getPostsBySearch(searchQuery: String!): PostsPayload
    }

    type Mutation {
        signUp(username: String!, givenName: String!, familyName: String!,
            email: String!, password: String!, confirmPassword: String!): AuthPayload
        signIn(email: String!, password: String!): AuthPayload
        uploadColor(name: String, value: String!): ColorPayload
        uploadDesign(name: String!, colors: [String!]!): DesignPayload,
        uploadPost(message: String!, selectedFile: String): PostPayload
        updatePost(id: ID!, message: String!, selectedFile: String): PostPayload
        deletePost(id: ID!): Boolean
        likePost(id: ID!): PostPayload
    }
`