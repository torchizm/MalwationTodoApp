class User {
    constructor(username, email, jwt, setUser) {
        this.username = username;
        this.email = email;
        this.jwt = jwt;
        this.setUser = setUser;
    }
}

export default User;