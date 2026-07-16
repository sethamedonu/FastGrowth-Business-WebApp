const bcrypt = require('bcryptjs');
bcrypt.hash('password', 12).then(hash => console.log(hash));
