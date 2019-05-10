import { PubSub } from 'apollo-server-express';

const pubsub = new PubSub();
const SERVICE_NEEDED_ADDED = 'SERVICE_NEEDED_ADDED';

export default {
  Query: {
    getNeededService: (parent, { id }, { models }) => models.NeededServices.findOne({ where: { id } }),
    getAllNeededServices: (parent, args, { models }) => models.NeededServices.findAll(),
  },

  Subscription: {
    newServiceNeeded: {
      subscribe: () => pubsub.asyncIterator(SERVICE_NEEDED_ADDED),
    },
  },

  Mutation: {
    createNeededService: async (parent, args, { models }) => {
      try {
        const serviceNeeded = await models.NeededServices.create({ ...args });
        // publish new event
        pubsub.publish(SERVICE_NEEDED_ADDED, { newServiceNeeded: serviceNeeded.dataValues });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
