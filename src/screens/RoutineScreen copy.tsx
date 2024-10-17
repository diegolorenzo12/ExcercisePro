import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Routine } from '../navigation/types';
import { RouteProp } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';



type RoutineScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Routine'>;
    route: RouteProp<RootStackParamList, 'Routine'>;
};

const client = generateClient<Schema>();

// Define types for Exercise and Routine
interface Exercise {
    id: string;
    name: string;
    bodyPart: string;
    equipment: string;
    gifUrl: string;
    target: string;
    secondaryMuscles: string[];
    instructions: string[];
}

const RoutineScreen: React.FC<RoutineScreenProps> = ({ navigation, route }) => {
    const { routine } = route.params;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = React.useState('');


    const fetchExercises = async (name: string) => {
        if (name.length === 0) {
            setExercises([]); // Clear exercises if input is empty
            return;
        }

        try {
            const response = await axios.get<Exercise[]>(`https://exercisedb.p.rapidapi.com/exercises/name/${name}?offset=0&limit=10`, {
                headers: {
                    'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
                    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                },
            });
            setExercises(response.data);
            //SsetIsSearching(false); // Reset searching state
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    const handleSearch = (text: string) => {
        setSearchTerm(text);
        //SsetIsSearching(true); // Set searching state to true
    };

    const handleSearchButtonPress = () => {
        fetchExercises(searchTerm); // Fetch exercises when the button is pressed
        setModalVisible(true); // Open the modal after fetching
    };

    const renderExerciseItem = ({ item }: { item: Exercise }) => (
        <TouchableOpacity
            className="p-2 border-b border-gray-300"
            onPress={() => addExercise(item)} // Add exercise to the list on press
        >
            <Text className="text-lg">{item.name}</Text>
        </TouchableOpacity>
    );

    const addExercise = (exercise: Exercise) => {
        setSelectedExercises((prev) => [...prev, exercise]); // Add exercise to the selected list
        setModalVisible(false); // Close the modal after adding
    };

    const createRoutine = async () => {
        try {
            // Step 1: Create a Routine
            const { errors, data: newRoutine } = await client.models.Routine.create({
                name: routine?.name || '',  // Provide a default empty string if name is undefined
                // You can specify 'id' if you have one, otherwise it will be auto-generated
            });

            if (errors) {
                console.error("Failed to create routine:", errors);
                return;
            }

            if (!newRoutine) {
                console.error("Failed to create routine.");
                return;
            }

            // Step 2: Create Exercises and Associate Them with the Routine
            for (const exercise of selectedExercises) {
                // Create a new ExerciseMuscle entry for each muscle associated with the exercise
                for (const muscleId of exercise.secondaryMuscles) {
                    await client.models.ExerciseMuscle.create({
                        exerciseId: exercise.id,
                        muscleId: muscleId,
                    });
                }

                // Create the exercise associated with the routine
                await client.models.Exercise.create({
                    ...exercise,
                    routineId: newRoutine.id, // Associate with the created routine
                });
            }

            // Optionally clear the selected exercises after creating the routine
            setSelectedExercises([]); // Clear the selected exercises after creating the routine
            console.log('Routine Created:', routine?.name, selectedExercises);
        } catch (error) {
            console.error('Error creating routine:', error);
        }
    };

    return (
        <View className="bg-black h-full">
            <View className="flex-1 justify-center items-center bg-gray-800 rounded-t-lg p-4">
                <Text className="text-white text-3xl text-center mb-4">{routine?.name}</Text>
                <Searchbar
                    placeholder="Search for exercises..."
                    className="bg-slate-500"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
                <TouchableOpacity
                    className="bg-blue-500 py-3 px-6 rounded-full mb-4"
                    onPress={handleSearchButtonPress} // Trigger search on button press
                >
                    <Text className="text-white text-lg">Search Exercises</Text>
                </TouchableOpacity>

                {/* List of selected exercises */}
                <ScrollView className="w-full mb-4">
                    {selectedExercises.map((exercise, index) => (
                        <View key={index} className="bg-gray-800 p-2 mb-2 rounded">
                            <Text className="text-white">{exercise.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    className="bg-green-500 py-3 px-6 rounded-full"
                    onPress={createRoutine} // Create routine on button press
                >
                    <Text className="text-white text-lg">Create Routine</Text>
                </TouchableOpacity>

                {/* Modal for displaying exercises */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible && exercises.length > 0} // Show modal only if there are exercises
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-80">
                        <View className="bg-white rounded-lg p-4 w-4/5">
                            <Text className="text-xl text-center mb-4">Select an Exercise</Text>
                            <FlatList
                                data={exercises}
                                renderItem={renderExerciseItem}
                                keyExtractor={(item) => item.id.toString()}
                            />
                            <TouchableOpacity
                                className="mt-4 bg-blue-500 py-2 rounded"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-white text-center">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

export default RoutineScreen;
