/** Serve Provided table */
export default (sequelize, DataTypes) => {
  const NeededServices = sequelize.define('needed_services', {
    title: DataTypes.STRING,
    username: DataTypes.STRING,
    description: DataTypes.STRING,
    address: DataTypes.STRING,
    photoUrl: DataTypes.STRING,
    date: DataTypes.DATE,
  });

  return NeededServices;
};
