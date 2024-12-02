import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { RouteProp } from '@react-navigation/native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import SetsAndReps from './SetsAndReps';


const client = generateClient<Schema>();
type ExerciseDetailsProps = {
    navigation: StackNavigationProp<RootStackParamList, 'ExerciseDetails'>;
    route: RouteProp<RootStackParamList, 'ExerciseDetails'>;
};

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({ navigation, route }) => {
    const { exercise } = route.params;
    const { routine } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    const handleAddExercise = async () => {
        setIsLoading(true);
        if (!exercise || !routine) {
            console.log("Exercise or Routine is undefined");
            return;
        }

        try {
            const newExercise = await client.models.Exercise.create({
                name: exercise.name,
                bodyPart: exercise.bodyPart,
                equipment: exercise.equipment,
                target: exercise.target,
                gifUrl: exercise.gifUrl,
                routineId: routine.id
            });

            if (exercise.secondaryMuscles) {
                await Promise.all(exercise.secondaryMuscles.map(async (muscleId) => {
                    if (newExercise.data !== null) {
                        // Fetch the muscle details
                        const muscle = await client.models.Muscle.get({ id: muscleId }); // Wrap muscleId in an object
                        if (muscle.data !== null) {
                            await client.models.ExerciseMuscle.create({
                                muscleId: muscle.data.id,
                                exerciseId: newExercise.data.id,
                            });
                        } else {
                            const muscle = await client.models.Muscle.create({
                                name: muscleId,
                            }).then(async (muscle) => {
                                if (muscle.data !== null && newExercise.data !== null) {
                                    await client.models.ExerciseMuscle.create({
                                        muscleId: muscle.data.id,
                                        exerciseId: newExercise.data.id,
                                    });
                                }
                            });
                        }
                    }
                }));
            }

            if (exercise.instructions) {
                await Promise.all(exercise.instructions.map(async (instruction) => {
                    if (newExercise.data !== null) {
                        await client.models.Instruction.create({
                            content: instruction,
                            exerciseId: newExercise.data.id
                        });
                    }
                }));
            }

            console.log("Exercise added to routine:", newExercise);
            navigation.navigate('Routine', { routine: routine })
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false);
    };

    return (
        <View className="bg-black h-full">
            <ScrollView className="flex-1 bg-gray-800 rounded-t-lg p-4 pb-10">
                <View className="flex flex-col items-center mb-10">
                    <Text className="text-white text-3xl text-center mb-4">{exercise?.name}</Text>
                    <Image
                        source={{ uri: exercise?.gifUrl }}
                        className="w-64 h-64 mb-4 items-center"
                        resizeMode="contain"
                    />
                    <View className="w-full mb-4 items-left">
                        <View className="pl-4">
                            <Text className="text-white text-xl mb-1">• Body Part: {exercise?.bodyPart}</Text>
                            <Text className="text-white text-xl mb-1">• Equipment: {exercise?.equipment}</Text>
                            <Text className="text-white text-xl mb-1">• Target: {exercise?.target}</Text>
                            <Text className="text-white text-xl mb-1">• Secondary Muscles:</Text>
                            <View className="pl-4">
                                {exercise?.secondaryMuscles.map((muscle, index) => (
                                    <Text key={index} className="text-white text-lg mb-1">- {muscle}</Text>
                                ))}
                            </View>
                        </View>
                        <Text className="text-white text-2xl my-4">Instructions:</Text>
                        {exercise?.instructions.map((instruction, index) => (
                            <Text key={index} className="text-white text-lg mb-1 text-left">• {instruction}</Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity
                onPress={()=>setModalVisible(true)}
                disabled={isLoading}
                className={`${isLoading ? 'bg-gray-400' : 'bg-blue-500'
                } py-3 px-6 rounded-full m-4 flex items-center justify-center`}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text className="text-white text-lg text-center">Add Exercise</Text>
                )}
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SetsAndReps route={route} navigation={navigation} setModalVisible={setModalVisible}></SetsAndReps>
            </Modal>
        </View>
    )
}

export default ExerciseDetails;
