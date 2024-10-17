import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Routine } from '../navigation/types';
import { RouteProp } from '@react-navigation/native';
import { Searchbar, Divider } from 'react-native-paper';



type RoutineScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Routine'>;
    route: RouteProp<RootStackParamList, 'Routine'>;
};

const client = generateClient<Schema>();

type Exercise = Schema['Exercise']['type'];


const RoutineScreen: React.FC<RoutineScreenProps> = ({ navigation, route }) => {
    const { routine } = route.params;
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [savedExercises, setSavedExercises] = React.useState<Exercise[]>([]);


    const handleAddExercise = () => {
        navigation.navigate('AddExercise', { routine: routine });
    };

    React.useEffect(() => {
        const sub = client.models.Exercise.observeQuery({
            filter: {
                routineId: { eq: routine?.id }
            }
        }).subscribe({
            next: ({ items, isSynced }) => {
                setSavedExercises([...items]);
            },
        });
        return () => sub.unsubscribe();
    }, [routine?.id]);

    return (
        <View className="bg-black h-full">
            <View className="flex-1 justify-center items-center bg-gray-800 rounded-t-lg p-4">
                <Text className="text-white text-3xl text-center mb-4">{routine?.name}</Text>
                <View className="flex flex-col justify-evenly items-center p-4 h-5/6 w-full">
                    <TouchableOpacity
                        className="bg-blue-500 py-3 px-6 rounded-full mb-4"
                        onPress={handleAddExercise}
                    >
                        <Text className="text-white text-lg">Add Exercises</Text>
                    </TouchableOpacity>

                    {savedExercises.length === 0 ? (
                        <Text className="text-white text-3xl text-center mb-4">You haven't added any exercises yet</Text>
                    ) : (
                        <>
                            <Text className="text-white text-3xl text-center mb-4">You have added {savedExercises.length} exercises</Text>
                            <ScrollView className="mb-4 w-full">
                                {savedExercises.map((exercise, index) => (
                                    <TouchableOpacity key={index} className="bg-gray-800 p-2 mb-2 rounded w-full"
                                        onPress={() => navigation.navigate('EditExercise', { routine: routine, exercise: exercise })}
                                    >
                                        <Text className="text-white p-3 text-xl">{exercise.name}</Text>
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
