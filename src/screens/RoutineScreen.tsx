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
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const fetchExercises = async (name: string) => {
        //here i should fetch from the exercises that the user has in amplify
    };

    const handleAddExercise = () => {
        navigation.navigate('AddExercise', { routine: routine });
    };

    return (
        <View className="bg-black h-full">
            <View className="flex-1 justify-center items-center bg-gray-800 rounded-t-lg p-4">
                <Text className="text-white text-3xl text-center mb-4">{routine?.name}</Text>
                <View className="flex flex-col justify-evenly items-center p-4 h-5/6">
                    <TouchableOpacity
                        className="bg-blue-500 py-3 px-6 rounded-full mb-4"
                        onPress={handleAddExercise}
                    >
                        <Text className="text-white text-lg">Add Exercises</Text>
                    </TouchableOpacity>

                    {exercises.length === 0 ? (
                        <Text className="text-white text-3xl text-center mb-4">You haven't added any exercises yet</Text>
                    ) : (
                        <>
                            <Text className="text-white text-3xl text-center mb-4">You have added {selectedExercises.length} exercises</Text>
                            <ScrollView className="w-full mb-4">
                                {exercises.map((exercise, index) => (
                                    <View key={index} className="bg-gray-800 p-2 mb-2 rounded">
                                        <Text className="text-white">{exercise.name}</Text>
                                    </View>
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
