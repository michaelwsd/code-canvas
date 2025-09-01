const users = []

export const addUser = ({username, roomId, userId, sockedId}) => {
    const user = {username, roomId, userId, sockedId};
    users.push(user);
    return users.filter((user) => user.roomId === roomId);
}

export function removeUser(socketId) {
    const index = users.findIndex((user) => user.sockedId === socketId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

export const getUser = (socketId) => {
    return users.find((user) => user.sockedId === socketId);
}

export const getUsersInRoom = (roomId) => {
    return users.filter((user) => user.roomId === roomId);
}

export const getAllUsers = () => {
    return users;
}