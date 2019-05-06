export default {
  Query: {
    getCategory: (parent, { id }, { models }) => models.Category.findOne({ where: { id } }),
    getAllCategories: (parent, args, { models }) => models.Category.findAll(),
  },
  Mutation: {
    createCategory: (parent, args, { models }) => models.Category.create(args),
  },
};
