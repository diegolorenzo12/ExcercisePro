import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { RouteProp } from '@react-navigation/native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';



type Instruction = Schema['Instruction']['type'];
type ExerciseMuscle = Schema['ExerciseMuscle']['type'];
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
    //const [muscles, setMuscles] = useState<Muscle[]>([]);

    const handleDeleteExercise = async () => {
        if (!exercise) {
            console.log("Exercise or Routine is undefined");
            return;
        }

        try {
            const newExercise = await client.models.Exercise.delete({
                id: exercise.id
            });

            console.log("Deleted from routine:", newExercise);
            navigation.navigate('Routine', { routine: routine })
        } catch (error) {
            console.log(error)
        }
    };


    React.useEffect(() => {
        if (exercise) {
            // Eager load muscles and instructions

            const loadExerciseDetails = async () => {
                try {
                    const instruction = (await exercise.instructions()).data;
                    setInstructions(instruction)
                    //need to fetch muscles latter
                } catch (error) {
                    console.error('Error loading exercise details:', error);
                }
            };
            loadExerciseDetails();
        }
    }, [exercise]);

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
                            {/* <Text className="text-white text-xl mb-1">• Secondary Muscles:</Text>
                            <View className="pl-4">
                                {/* {muscles.map((muscle, index) => (
                                    <Text key={index} className="text-white text-lg mb-1">- {muscle.name}</Text>
                                ))} */}
                            {/* {exercise?.secondaryMuscles.map((muscle, index) => (
                                    <Text key={index} className="text-white text-lg mb-1">- {muscle}</Text>
                                ))} 
                            </View> */}
                        </View>
                        <Text className="text-white text-2xl my-4">Instructions:</Text>
                        {instructions.map((instruction, index) => (
                            <Text key={index} className="text-white text-lg mb-1 text-left">• {instruction.content}</Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity
                className="bg-red-500 py-3 px-6 rounded-full m-4"
                onPress={handleDeleteExercise}
            >
                <Text className="text-white text-lg text-center">Delete Exercise</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ExerciseEdit;
