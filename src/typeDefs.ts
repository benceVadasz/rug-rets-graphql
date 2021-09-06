import {gql} from "apollo-server-express";

export const typeDefs = gql`
    type User {
        _id: ID
        username: String!
        givenName: String!
        familyName: String!
        email: String!
        phone: String
        profilePicture: String
        street: String
        zipcode: Int
        city: String
        other: String
    }

    #    fragment addressDetails on User {
    #        street
    #        zipcode
    #        city
    #        other
    #    }

    type Color {
        name: String!
        value: String!
        user: String!
        _id: ID!
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

    type Comment {
        username: String!
        text: String!
        createdAt: Date
    }

    type Post {
        _id: ID!
        message: String!
        selectedFile: String
        likes: [String!]!
        comments: [Comment!]!
        createdAt: Date!
        userId: User
        username: String
        profilePicture: String
    }

    type PostPayload {
        post: Post!
    }

    type PostsPayload {
        posts: [Post!]!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User!
        getAllUsers: [User!]!
        getColors: [Color!]!
        colorExists(hex: String!): Boolean
        getDesigns: [Design!]!
        getPosts(searchQuery: String): [Post!]!
        getPost(id: ID!): Post
        getPostsByCreator(id: ID!): PostsPayload
        getMyPosts: [Post!]!
        getPostsBySearch(searchQuery: String!): [Post!]!
        getPostsGroupedByUsers: [Post]
    }

    type Mutation {
        signUp(username: String!, givenName: String!, familyName: String!,
            email: String!, password: String!): AuthPayload
        signIn(email: String!, password: String!): AuthPayload
        uploadColor(name: String, value: String!): ColorPayload
        deleteColor(id: ID!): Boolean
        uploadDesign(name: String!, colors: [String!]!, shape: String!): DesignPayload,
        uploadPost(message: String!, selectedFile: String): PostPayload
        updatePost(id: ID!, message: String!, selectedFile: String): PostPayload
        deletePost(id: ID!): Boolean
        likePost(id: ID!): PostPayload
        commentPost(id: ID!, comment: String!): Post
        updateProfile(username: String!, givenName: String!,
            familyName: String!, email: String!, profilePicture: String, phone: String): User
    }

    scalar Date
`