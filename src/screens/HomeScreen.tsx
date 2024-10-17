import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { Divider } from 'react-native-paper';


//type Routine = Schema['Routine']['type'];

type Routine = Schema['Routine']['type'] & {
    owner?: string | null; // Allow owner to be optional and nullable
};


const client = generateClient<Schema>();
type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const [routines, setRoutines] = useState<Routine[]>([]);

    useEffect(() => {
        const sub = client.models.Routine.observeQuery().subscribe({
            next: ({ items, isSynced }) => {
                setRoutines([...items]);
            },
        });
        return () => sub.unsubscribe();
    }, []);


    return (
        <View className="bg-black w-full h-full">
            <View className="bg-gray-800 px-6 rounded-t-lg h-full w-full justify-evenly items-center flex">
                {routines.length === 0 ? (
                    <View className="flex items-center justify-center h-full">
                        <Text className="text-white text-3xl text-center mb-4">
                            You haven’t created any routines.
                        </Text>
                        <TouchableOpacity
                            className="bg-blue-600 py-3 px-4 rounded-full w-1/2"
                            onPress={() => navigation.navigate('CreateRoutine')}
                        >
                            <Text className="text-white text-lg text-center">Create routine</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity
                            className="bg-blue-600 my-5 py-3 px-4 rounded-full w-1/2"
                            onPress={() => navigation.navigate('CreateRoutine')}
                        >
                            <Text className="text-white text-lg text-center">Create routine</Text>
                        </TouchableOpacity>
                        <ScrollView className="w-full">
                            {routines.map((routine) => (
                                <TouchableOpacity key={routine.id} onPress={() => navigation.navigate('Routine', { routine: routine })}>
                                    <Divider />
                                    <Text className="text-white text-xl text-left p-4">{routine.name}</Text>
                                    <Divider />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                    </>
                )}
            </View>
        </View>
    );
};

export default HomeScreen;
