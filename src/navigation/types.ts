export type RootStackParamList = {
    Home: undefined;
    Routine: { routine?: Routine }; // Define the routine parameter
    Profile: undefined;
    CreateRoutine: undefined;
    AddExercise: { routine?: Routine };
    ExerciseDetails: { routine?: Routine, exercise?: Exercise };
}

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


