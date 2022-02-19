const Role = require("../models/Role");

const checkRoles = () => {
    Role.findOne({ name: 'user' }).then(r =>{
        if (r === null) {
            new Role({
                name: 'user'
            }).save(() => {
                console.log('Created User role');
            });
        }

        created = true;
    });

    Role.findOne({ name: 'admin' }).then(r => {
        if (r === null) {
            new Role({
                name: 'admin'
            }).save(() => {
                console.log('Created Admin role');
            });
        }
    });
};

module.exports = checkRoles;