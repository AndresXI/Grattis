import Sequelize from 'sequelize';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


export default async () => {
  let maxReconnects = 20;
  let connected = false;
  let sequelize;
  while (!connected && maxReconnects) {
    // connect to postgres
    try {
      sequelize = new Sequelize('grattis', 'postgres', 'barcelona10', {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
      });
      connected = true;
    } catch (err) {
      console.log('reconnecting in 5 seconds');
      // eslit-disable-next-line no-await-in-loop
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
