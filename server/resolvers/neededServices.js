export default {
  Query: {
    getNeededService: (parent, { id }, { models }) => models.NeededServices.findOne({ where: { id } }),
    getAllNeededServices: (parent, args, { models }) => models.NeededServices.findAll(),
  },

  Mutation: {
    createNeededService: async (parent, args, { models, category }) => {
      try {
        await models.NeededServices.create({ ...args, category_id: category.id });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
