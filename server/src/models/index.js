import Sequelize from 'sequelize';

// connect to postgres
const sequelize = new Sequelize('grattis', 'postgres', 'barcelona10', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
});

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

export default models;
