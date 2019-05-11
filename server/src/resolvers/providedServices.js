import { PubSub } from 'apollo-server-express';

const pubsub = new PubSub();
const SERVICE_ADDED = 'SERVICE_ADDED';

export default {
  Query: {
    getProvidedService: (parent, { id }, { models }) => models.ProvidedServices.findOne({ where: { id } }),
    getAllProvidedServices: (parent, args, { models }) => models.ProvidedServices.findAll(),
  },

  Subscription: {
    newServiceProvided: {
      subscribe: () => pubsub.asyncIterator(SERVICE_ADDED),
    },
  },

  Mutation: {
    createProvidedService: async (parent, args, { models }) => {
      try {
        const serviceProvided = await models.ProvidedServices.create({ ...args });
        // publish new event
        pubsub.publish(SERVICE_ADDED, { newServiceProvided: serviceProvided.dataValues });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
