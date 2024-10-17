import type { Schema } from '@/amplify/data/resource';

export type RootStackParamList = {
    Home: undefined;
    Routine: { routine?: RoutineSchema }; // Define the routine parameter
    Profile: undefined;
    CreateRoutine: undefined;
    AddExercise: { routine?: RoutineSchema };
    ExerciseDetails: { routine?: RoutineSchema, exercise?: Exercise };
    EditExercise: { routine?: RoutineSchema, exercise?: ExerciseSchema };
}

type ExerciseSchema = Schema['Exercise']['type'];
type RoutineSchema = Schema['Routine']['type'] & {
    owner?: string | null; // Allow owner to be optional and nullable
};



export type Routine = {
    createdAt: string;
    exercises: any;
    id: string;
    name: string;
    owner: string;
    updatedAt: string;
};


export type Exercise = {
    bodyPart: string;
    equipment: string;
    gifUrl: string;
    id: string;
    instructions: string[];
    name: string;
    secondaryMuscles: string[];
    target: string;
}


