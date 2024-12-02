import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { RouteProp } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';


export type RoutineScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Routine'>;
    route: RouteProp<RootStackParamList, 'Routine'>;
};

const client = generateClient<Schema>();

type Exercise = Schema['Exercise']['type'];
type ExerciseRoutine = Schema['ExerciseRoutine']['type'];


const RoutineScreen: React.FC<RoutineScreenProps> = ({ navigation, route }) => {
    const { routine } = route.params;
    const [savedExercises, setSavedExercises] = React.useState<Exercise[]>([]);
    const [exerciseRoutines, setExerciseRoutines] = useState<(ExerciseRoutine & { exercise: Exercise })[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [editMode, setEditMode] = useState<Boolean>(false);

    const handleAddExercise = () => {
        navigation.navigate('AddExercise', { routine: routine });
    };


    const handleDeleteExercise = async (exerciseId: string) => {
        if (!exerciseId) {
            console.log("Exercise or Routine is undefined");
            return;
        }

        try {
            const newExercise = await client.models.Exercise.delete({
                id: exerciseId
            });

            console.log("Deleted from routine:", newExercise);
            navigation.navigate('Routine', { routine: routine })
        } catch (error) {
            console.error('Error:', JSON.stringify(error, null, 2));
        }
    };

    React.useEffect(() => {
        const sub = client.models.Exercise.observeQuery({
            filter: {
                routineId: { eq: routine?.id }
            }
        }).subscribe({
            next: ({ items, isSynced }) => {
                setSavedExercises([...items]);
                setLoading(!isSynced);
            },
        });
        return () => sub.unsubscribe();
    }, [routine?.id]);

    // React.useEffect(() => {
    //     const fetchExerciseRoutines = async () => {
    //         setLoading(true);
    //         try {
    //             // Fetch all ExerciseRoutine entries for the routine
    //             const { items: routines } = await client.models.ExerciseRoutine.query({
    //                 filter: { routineId: { eq: routine?.id } },
    //             });

    //             // Fetch related Exercise entries for each ExerciseRoutine
    //             const routinesWithExercises = await Promise.all(
    //                 routines.map(async (routine) => {
    //                     const exercise = await client.models.Exercise.get(routine.exerciseId);
    //                     return { ...routine, exercise };
    //                 })
    //             );

    //             setExerciseRoutines(routinesWithExercises as (ExerciseRoutine & { exercise: Exercise })[]);
    //         } catch (error) {
    //             console.error('Error fetching exercises:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchExerciseRoutines();
    // }, [routine?.id]);

    return (
        <View className="bg-black h-full">
            <View className="flex-1 justify-center items-center bg-gray-800 rounded-t-lg p-4">
                <Text className="text-white text-3xl text-center mb-4">{routine?.name}</Text>
                <View className="flex flex-col justify-evenly items-center p-4 h-5/6 w-full">
                    <View className='flex flex-row items-center justify-evenly w-full m-2 mb-6'>
                        <TouchableOpacity
                            className="bg-blue-600 py-3 px-4 rounded-full w-1/2 flex flex-row items-center justify-center"
                            onPress={handleAddExercise}
                        >
                            <Text className="text-white text-lg text-center">Add Exercise</Text>
                            <MaterialIcons name="add" size={30} color="white" className="mr-2" />
                        </TouchableOpacity>
                        {
                            savedExercises.length === 0 ? null : (
                                <Text className='text-blue-600 font-medium text-xl' onPress={() => setEditMode(!editMode)}>
                                    {editMode? "Cancel": "Edit"} 
                                </Text>
                            )
                        }
                    </View>

                    {
                        loading ? (
                            // Circular progress indicator
                            <View className="flex items-center justify-center h-full">
                                <ActivityIndicator size="large" />
                                <Text className="text-white text-lg mt-4">Loading...</Text>
                            </View>
                        ) :
                            savedExercises.length === 0 ? (
                                <Text className="text-white text-3xl text-center mb-4">You haven't added any exercises yet</Text>
                            ) : (
                                <>
                                    <ScrollView className="mb-4 w-full">
                                        {savedExercises.map((exercise, index) => (
                                            <TouchableOpacity key={index} className="bg-gray-800 rounded w-full"
                                                onPress={() => navigation.navigate('EditExercise', { routine: routine, exercise: exercise })}
                                            >
                                                <Divider />
                                                <View className="flex flex-row items-center justify-between">
                                                    <Text className="text-white p-3 text-xl">{exercise.name.length > 20 && editMode ? `${exercise.name.slice(0, 27)}...` : exercise.name}</Text>
                                                    {editMode && <MaterialIcons name="delete" size={30} color="white" className="mr-2" onPress={() => handleDeleteExercise(exercise.id)} />}
                                                </View>
                                                <Divider />
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </>
                            )}
                </View>
            </View>
        </View>
    );
};

export default RoutineScreen;
