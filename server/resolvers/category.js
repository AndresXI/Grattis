export default {
  Query: {
    getCategory: (parent, { id }, { models }) => models.Category.findOne({ where: { id } }),
    getAllCategories: (parent, args, { models }) => models.Category.findAll(),
  },
  Mutation: {
    createCategory: async (parent, args, { models }) => {
      try {
        await models.Category.create(args);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
