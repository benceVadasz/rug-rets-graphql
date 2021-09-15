function newMessageSubscribe(_:any, args: any, context: any) {
    return context.pubsub.asyncIterator("NEW_MESSAGE")
}

export const newMessage = {
    subscribe: newMessageSubscribe,
    resolve: (payload: any) => {
        return payload
    },
}

export const Subscription = {
    newMessage
}
