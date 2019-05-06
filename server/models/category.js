/** Categories Table */
export default (sequelize, DataTypes) => {
  const Category = sequelize.define('category', {
    title: DataTypes.STRING,
  });

  // Define associations
  Category.associate = (models) => {
    // 1 to many with Provided Services
    Category.hasMany(models.ProvidedServices, {
      foreignKey: 'category_id',
    });

    // 1 to many with Needed Services
    Category.hasMany(models.NeededServices, {
      foreignKey: 'category_id',
    });
  };

  return Category;
};
