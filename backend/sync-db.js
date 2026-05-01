const { sequelize } = require('./models');

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database forcefully synced.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error syncing:', err);
    process.exit(1);
  });
