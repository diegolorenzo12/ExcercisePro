import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';


const client = generateClient<Schema>()


type SetsAndRepsProps = {
    navigation: StackNavigationProp<RootStackParamList, "ExerciseDetails">;
    route: RouteProp<RootStackParamList, 'ExerciseDetails'>;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function SetsAndReps({ navigation, route, setModalVisible }: SetsAndRepsProps) {
    const { exercise } = route.params;
    const { routine } = route.params;
    const [sets, setSets] = useState<string>();
    const [reps, setReps] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddExercise = async () => {
        setIsLoading(true);
        if (!exercise || !routine || !sets || !reps) { // Ensure sets and reps are provided
            console.log("Exercise, Routine, Sets, or Reps is undefined");
            setIsLoading(false);
            return;
        }

        try {
            // Create the new exercise
            const newExercise = await client.models.Exercise.create({
                name: exercise.name,
                bodyPart: exercise.bodyPart,
                equipment: exercise.equipment,
                target: exercise.target,
                gifUrl: exercise.gifUrl,
                routineId: routine.id
            });

            if (newExercise.data !== null) {
                // Link exercise to the routine with sets and reps
                await client.models.ExerciseRoutine.create({
                    exerciseId: newExercise.data.id,
                    routineId: routine.id,
                    sets: Number(sets), // Add sets
                    reps: Number(reps), // Add reps
                });

                // Add secondary muscles if provided
                if (exercise.secondaryMuscles) {
                    await Promise.all(
                        exercise.secondaryMuscles.map(async (muscleId) => {
                            if (newExercise.data !== null) {
                                const muscle = await client.models.Muscle.get({ id: muscleId });
    
                                if (muscle.data !== null) {
                                    await client.models.ExerciseMuscle.create({
                                        muscleId: muscle.data.id,
                                        exerciseId: newExercise.data.id,
                                    });
                                } else {
                                    // Create the muscle if it doesn't exist
                                    const newMuscle = await client.models.Muscle.create({
                                        name: muscleId,
                                    });
    
                                    if (newMuscle.data !== null) {
                                        await client.models.ExerciseMuscle.create({
                                            muscleId: newMuscle.data.id,
                                            exerciseId: newExercise.data.id,
                                        });
                                    }
                                }
                            }
                        })
                    );
                }

                // Add instructions if provided
                if (exercise.instructions) {
                    await Promise.all(
                        exercise.instructions.map(async (instruction) => {
                            if (newExercise.data !== null) {
                                await client.models.Instruction.create({
                                    content: instruction,
                                    exerciseId: newExercise.data.id,
                                });
                            }
                        })
                    );
                }
            }

            console.log("Exercise added to routine:", newExercise);
            navigation.navigate('Routine', { routine: routine });
        } catch (error) {
            console.error("Error adding exercise:", error);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <View className="bg-black/[.5] h-full justify-center items-center px-2">
            <View className="bg-gray-800 rounded-lg h-1/2 w-full mx-6 justify-evenly items-center">
                <Text className="text-white text-3xl text-center mb-4">
                    Add sets and reps
                </Text>
                <TextInput
                    className="text-white text-lg text-center mb-4 border-b border-white w-full"
                    placeholder="Sets"
                    placeholderTextColor="#ccc"
                    keyboardType='numeric'
                    value={sets}
                    onChangeText={setSets} // Update routine name on input change
                />
                <TextInput
                    className="text-white text-lg text-center mb-4 border-b border-white w-full"
                    placeholder="Reps"
                    placeholderTextColor="#ccc"
                    keyboardType='numeric'
                    value={reps}
                    onChangeText={setReps} // Update routine name on input change
                />
                <View className="flex flex-row justify-evenly items-center w-full">
                    <TouchableOpacity
                        className="bg-red-500 py-3 rounded-full w-1/3"
                        onPress={() => setModalVisible(false)}
                    >
                        <Text className="text-white text-lg text-center">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleAddExercise} // Call createNewRoutine on press
                        disabled={isLoading}
                        className={`${isLoading ? 'bg-gray-400' : 'bg-blue-600'
                            } py-3 rounded-full w-1/3`}
                    >
                        <Text className="text-white text-lg text-center">Create</Text>
                    </TouchableOpacity>                   
                </View>
            </View>
        </View>
    )
}


// onPress = {() => navigation.navigate('ExerciseDetails', { routine: routine, exercise: exercise })}