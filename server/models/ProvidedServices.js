/** Serve Provided table */
export default (sequelize, DataTypes) => {
  const ProvidedServices = sequelize.define('provided_services', {
    title: DataTypes.STRING,
    username: DataTypes.STRING,
    description: DataTypes.STRING,
    address: DataTypes.STRING,
    addressCoords: DataTypes.STRING,
    photoUrl: DataTypes.STRING,
    date: DataTypes.DATE,
  });

  return ProvidedServices;
};
