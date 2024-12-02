import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Routine: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      exercises: a.hasMany('ExerciseRoutine', 'routineId'), // Change to ExerciseRoutine join model
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
      exerciseMuscles: a.hasMany('ExerciseMuscle', 'exerciseId'),
      instructions: a.hasMany('Instruction', 'exerciseId'),
      routineId: a.id().required(),
      exerciseRoutines: a.hasMany('ExerciseRoutine', 'exerciseId'),
    })
    .identifier(['id']),

  Muscle: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      exerciseMuscles: a.hasMany('ExerciseMuscle', 'muscleId'),
    })
    .identifier(['id']),

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

  // New join model for the relationship between Exercise and Routine
  ExerciseRoutine: a
    .model({
      id: a.id().required(),
      exerciseId: a.id().required(),
      routineId: a.id().required(),
      sets: a.integer().required(),
      reps: a.integer().required(),
      exercise: a.belongsTo('Exercise', 'exerciseId'),
      routine: a.belongsTo('Routine', 'routineId'),
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
