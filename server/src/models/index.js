import Sequelize from 'sequelize';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


export default async () => {
  let maxReconnects = 20;
  let connected = false;
  const sequelize = new Sequelize('grattis', 'postgres', 'barcelona10', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  });
  while (!connected && maxReconnects) {
    // connect to postgres
    try {
      // eslint-disable-next-line no-await-in-loop
      await sequelize.authenticate();
      connected = true;
    } catch (err) {
      console.log('reconnecting in 5 seconds');
      // eslint-disable-next-line no-await-in-loop
      await sleep(5000);
      maxReconnects -= 1;
    }
  }

  if (!connected) {
    return null;
  }

  // tables
  const models = {
    ProvidedServices: sequelize.import('./ProvidedServices'),
    NeededServices: sequelize.import('./NeededServices'),
    Category: sequelize.import('./Category'),
  };

  // Set associations
  Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  return models;
};
