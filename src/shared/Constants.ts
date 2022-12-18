enum MessageTypes {
    CONNECTION = 'connection', // server
    CONNECT = 'connect', // client
    DISCONNECT = 'disconnect',
    INITIALIZE = 'initialize',
    PING = 'ping',
    MESSAGE = 'message',
    UPDATE = 'update'
};

export default MessageTypes;