const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const User = require('../models/User');

async function checkUsers() {
  await sequelize.authenticate();
  const users = await User.findAll();
  console.log(`Found ${users.length} users in the database.`);
  
  for (const user of users) {
    console.log(`Username: ${user.username}`);
    console.log(`Password Hash: ${user.password}`);
    const match = await bcrypt.compare('admin12345', user.password);
    console.log(`Password match check for "admin12345": ${match}`);
  }
  process.exit(0);
}

checkUsers().catch(err => {
  console.error(err);
  process.exit(1);
});
