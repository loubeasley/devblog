function fieldErr (field, type, msg, value) {
    return {
        field,
        type,
        message: msg,
        value
    }
}

export default {
    username: username => {
        let field = 'username';
        if(!username || username.length < 1)
            return fieldErr(field, 'failed', 'Username is empty.', username);

        if(!username.match(/^[A-Za-z0-9_@.]*$/))
            return fieldErr(field, 'failed', 'Username failed criteria.', username);

        if(username.length < 3)
            return fieldErr(field, 'failed', 'Username is too short.', username);

        if(username.length > 20)
            return fieldErr(field, 'failed', 'Username is too long.', username);

        return true;
    },
    password: password => {
        let field = 'password';

        if(!password || password.length < 1)
            return fieldErr(field, 'failed', 'Password is empty.', username);

        if(password.length < 8)
            return fieldErr(field, 'failed', 'Password is too short.', password);

        if(password.length > 40)
            return fieldErr(field, 'failed', 'Password is too long.', password);

        return true;
    }
}