export default {
    username: username => {
        if(!username) return '';
        return username.replace(/^[A-Za-z0-9_@.]*$/, '').toLowerCase();
    },
    password: password => {
        if(!password) return '';
        return password;
    }
};