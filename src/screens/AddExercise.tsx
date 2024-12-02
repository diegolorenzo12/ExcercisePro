import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Searchbar } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import { Exercise as ExerciseType } from '../navigation/types';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';


type AddExerciseProps = {
    navigation: StackNavigationProp<RootStackParamList, "AddExercise">;
    route: RouteProp<RootStackParamList, 'AddExercise'>;
};


const AddExercise: React.FC<AddExerciseProps> = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [exercises, setExercises] = React.useState<ExerciseType[]>([]); // Add state for exercises
    const [loading, setLoading] = React.useState(false); // Add loading state

    const routine = route.params.routine;

    React.useEffect(() => {
        const fetchExercises = async () => {
            if (searchQuery) {
                setLoading(true);
                try {
                    const response = await axios.get<ExerciseType[]>(`https://exercisedb.p.rapidapi.com/exercises/name/${searchQuery}?offset=0&limit=10`, {
                        headers: {
                            'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
                            'x-rapidapi-key': "b12464a8b4msh6a0f2e55d3a22b5p1e4280jsn07fea728e5d1",
                        },
                    });
                    console.log(response.data[0])
                    setExercises(response.data);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchExercises();
    }, [searchQuery]); // Fetch exercises when searchQuery changes


    return (
        <View className="bg-black h-full">
            <View className="flex-1 justify-start items-center bg-gray-800 rounded-t-lg p-4">
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    className="m-3"
                />
                <Text className="text-white text-3xl text-left">Results</Text>
                <View className="w-full mt-5">
                    <Divider />
                    {loading ? (
                        <Text className="text-white">Loading...</Text>
                    ) : exercises.length > 0 ? (
                        exercises.map((exercise) => (
                            <TouchableOpacity
                                key={exercise.id}
                                onPress={() => navigation.navigate('ExerciseDetails', { routine: routine, exercise: exercise })}
                            >
                                <View>
                                    <Text className="m-2 text-white text-xl text-left">
                                        {exercise.name}
                                    </Text>
                                    <Divider />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text className="m-2 text-white text-xl text-left">No results found</Text>
                    )}
                </View>
                <Divider />
            </View>
        </View>
    );
}

export default AddExercise;
