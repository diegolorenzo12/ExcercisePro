import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { RouteProp } from '@react-navigation/native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';



type Instruction = Schema['Instruction']['type'];
type ExerciseMuscle = Schema['ExerciseMuscle']['type'];
type ExerciseRoutine = Schema['ExerciseRoutine']['type'];
type Muscle = Schema['Muscle']['type'];


const client = generateClient<Schema>();

type ExerciseEditProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EditExercise'>;
    route: RouteProp<RootStackParamList, 'EditExercise'>;
};

const ExerciseEdit: React.FC<ExerciseEditProps> = ({ navigation, route }) => {
    const { exercise } = route.params;
    const { routine } = route.params;
    const [instructions, setInstructions] = useState<Instruction[]>([]);
    const [sets, setSets] = useState<number | null>(null);
    const [reps, setReps] = useState<number | null>(null);

    React.useEffect(() => {
        if (exercise) {
            // Eager load muscles and instructions

            const loadExerciseDetails = async () => {
                try {
                    const instruction = (await exercise.instructions()).data;
                    setInstructions(instruction)

                    if(routine !== undefined) {
                        const exerciseRoutineResponse = await client.models.ExerciseRoutine.list({
                            filter: {
                                exerciseId: { eq: exercise.id },
                                routineId: { eq: routine.id },
                            },
                        });
                        const exerciseRoutine = exerciseRoutineResponse.data?.[0];
                        if (exerciseRoutine) {
                            setSets(exerciseRoutine.sets);
                            setReps(exerciseRoutine.reps);
                        }
                    }
                } catch (error) {
                    console.error('Error loading exercise details:', error);
                }
            };
            loadExerciseDetails();
        }
    }, [exercise, routine]);

    return (
        <View className="bg-black h-full">
            <ScrollView className="flex-1 bg-gray-800 rounded-t-lg p-4 pb-10">
                <View className="flex flex-col items-center mb-10">
                    <Text className="text-white text-3xl text-center mb-4">{exercise?.name}</Text>
                    <Image
                        source={{ uri: exercise?.gifUrl || undefined }} // Ensure uri is either a string or undefined
                        className="w-64 h-64 mb-4 items-center"
                        resizeMode="contain"
                    />
                    <View className="w-full mb-4 items-left">
                        <View className="pl-4">
                            <Text className="text-white text-xl mb-1">• Body Part: {exercise?.bodyPart}</Text>
                            <Text className="text-white text-xl mb-1">• Equipment: {exercise?.equipment}</Text>
                            <Text className="text-white text-xl mb-1">• Target: {exercise?.target}</Text>
                          
                            <Text className="text-white text-xl mt-4 mb-2">Sets and Reps:</Text>
                            <View className="pl-4">
                                <Text className="text-white text-lg mb-1">• Sets: {sets ?? 'N/A'}</Text>
                                <Text className="text-white text-lg mb-1">• Reps: {reps ?? 'N/A'}</Text>
                            </View>
                        </View>
                        <Text className="text-white text-2xl my-4">Instructions:</Text>
                        {instructions.map((instruction, index) => (
                            <Text key={index} className="text-white text-lg mb-1 text-left">• {instruction.content}</Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default ExerciseEdit;
