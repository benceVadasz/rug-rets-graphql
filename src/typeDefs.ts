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
    

    type AuthPayload {
        token: String!
        user: User!
    }

    type Message {
        uuid: String!
        text: String!
        from: User
        to: User
        createdAt: Date
    }
    
    type Subscription {
        newMessage: Message
    }

    type Query {
        me: User!
        getAllUsers: [User!]!
        getColors: [Color!]!
        colorExists(hex: String!): Boolean
        getDesigns: [Design!]!
        getPosts(searchQuery: String): [Post!]!
        getAllPosts: [Post!]!
        getPost(id: ID!): Post
        getPostsByCreator(username: String!): [Post!]!
        getMyPosts: [Post!]!
        getPostsBySearch(searchQuery: String!): [Post!]!
        getPostsGroupedByUsers: [Post]
        getMessages(mate: ID!): [Message]!
    }

    type Mutation {
        signUp(username: String!, givenName: String!, familyName: String!,
            email: String!, password: String!): AuthPayload
        signIn(email: String!, password: String!): AuthPayload
        uploadColor(name: String, value: String!): ColorPayload
        deleteColor(id: ID!): Boolean
        uploadDesign(name: String!, colors: [String!]!, shape: String!): DesignPayload,
        uploadPost(message: String!, selectedFile: String): Post!
        updatePost(id: ID!, message: String!, selectedFile: String): Post!
        deletePost(id: ID!): Boolean
        likePost(id: ID!): Post!
        commentPost(id: ID!, comment: String!): Post
        updateProfile(username: String!, givenName: String!,
            familyName: String!, email: String!, profilePicture: String, phone: String): User
        sendMessage(to: ID!, text: String!): Message!
    }

    
    scalar Date
`