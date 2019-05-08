export default {
  Query: {
    getNeededService: (parent, { id }, { models }) => models.NeededServices.findOne({ where: { id } }),
    getAllNeededServices: (parent, args, { models }) => models.NeededServices.findAll(),
  },

  Mutation: {
    createNeededService: async (parent, args, { models }) => {
      try {
        await models.NeededServices.create({ ...args });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
