import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Routine: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      exercises: a.hasMany('Exercise', 'routineId'),
    })
    .identifier(['id']),

  Exercise: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      bodyPart: a.string(),
      equipment: a.string(),
      gifUrl: a.string(),
      target: a.string(),
      // Updated relationship
      exerciseMuscles: a.hasMany('ExerciseMuscle', 'exerciseId'),
      instructions: a.hasMany('Instruction', 'exerciseId'),
      routineId: a.id().required(),
      routine: a.belongsTo('Routine', 'routineId'),
    })
    .identifier(['id']),

  Muscle: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      // Updated relationship
      exerciseMuscles: a.hasMany('ExerciseMuscle', 'muscleId'),
    })
    .identifier(['id']),

  // New join model for the many-to-many relationship
  ExerciseMuscle: a
    .model({
      id: a.id().required(),
      exerciseId: a.id().required(),
      muscleId: a.id().required(),
      exercise: a.belongsTo('Exercise', 'exerciseId'),
      muscle: a.belongsTo('Muscle', 'muscleId'),
    })
    .identifier(['id']),

  Instruction: a
    .model({
      id: a.id().required(),
      content: a.string().required(),
      exerciseId: a.id().required(),
      exercise: a.belongsTo('Exercise', 'exerciseId'),
    })
    .identifier(['id']),
})
  .authorization((allow) => [allow.owner()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",  // Use Cognito User Pools for authentication
  },
});
