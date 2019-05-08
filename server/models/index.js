import Sequelize from 'sequelize';

// connect to postgres
const sequelize = new Sequelize(process.env.DB, process.env.USERNAME, process.env.PASSWORD, {
  dialect: 'postgres',
});

// tables
const models = {
  ProvidedServices: sequelize.import('./ProvidedServices'),
  Category: sequelize.import('./category'),
};

// Set associations
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
