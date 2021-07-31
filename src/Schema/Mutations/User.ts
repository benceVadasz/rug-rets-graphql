import { GraphQLString } from "graphql";
import {UserType} from "../typeDefs";
import User from "../../Models/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {UserInputError} from 'apollo-server'

const defaultNewUser = {
    username: "",
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    confirmPassword: ""
}


export const SIGN_UP = {
    type: UserType,
    args: {
        username: { type: GraphQLString },
        givenName: { type: GraphQLString },
        familyName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        confirmPassword: { type: GraphQLString },
    },
    async resolve(parent: any, args= defaultNewUser) {
        const {username, givenName, familyName, email, password, confirmPassword} = args

        const existingUser = await User.findOne({email});
        if (existingUser) {
            throw new UserInputError('Email is taken', {
                errors: {
                    username: 'This email is taken'
                }
            });
        }
        if (password !== confirmPassword) {
            throw new UserInputError('Passwords do not match', {
                errors: {
                    password: 'Passwords do not match'
                }
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({username, givenName, familyName, password: hashedPassword, email});

        const token = jwt.sign({email: result.email, id: result._id},
            'test', {expiresIn: '1h'});

        return {
            args,
            id: result._id,
            token
        };
    },
};

const defaultUser = {
    email: "",
    password: "",
}

export const SIGN_IN = {
    type: UserType,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent: any, args= defaultUser) {
        const {email, password} = args

        const existingUser = await User.findOne( {email});
        if (!existingUser) {
            throw new UserInputError('User not found', {
                errors: {
                    email: "Email does not exist"
                }
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect){
            throw new UserInputError('Invalid credentials', {
                errors: {
                    email: email,
                    password: password
                }
            });
        }

        console.log('me here')
        const token = jwt.sign({email: existingUser.email, id: existingUser._id},
            'test', {expiresIn: '1h'})

        return {
            existingUser,
            token
        }
    },
};
