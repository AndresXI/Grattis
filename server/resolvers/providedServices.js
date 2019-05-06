export default {
  Query: {
    getProvidedService: (parent, { id }, { models }) => models.ProvidedServices.findOne({ where: { id } }),
    getAllProvidedServices: (parent, args, { models }) => models.ProvidedServices.findAll(),
  },

  Mutation: {
    createProvidedService: async (parent, args, { models, category }) => {
      try {
        await models.ProvidedServices.create({ ...args, category_id: category.id });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
