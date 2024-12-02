import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import CreateRoutine from './CreateRoutine';


type Routine = Schema['Routine']['type'] & {
    owner?: string | null; // Allow owner to be optional and nullable
};


const client = generateClient<Schema>();
type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [editMode, setEditMode] = useState<Boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const sub = client.models.Routine.observeQuery().subscribe({
            next: ({ items, isSynced }) => {
                setRoutines([...items]);
                console.log("Routines:", items);
                setLoading(!isSynced);
            },
        });
        return () => sub.unsubscribe();
    }, []);

    const handleDelete = async (routineId: string) => {
        try {
            // Delete the routine from the backend
            await client.models.Routine.delete({ id: routineId });

            // Update the local state to remove the deleted routine
            setRoutines((prevRoutines) =>
                prevRoutines.filter((routine) => routine.id !== routineId)
            );
        } catch (error) {
            console.error("Error deleting routine:", error);
        }
    };


    return (
        <View className="bg-black w-full h-full">
            <View className="bg-gray-800 px-6 rounded-t-lg h-full w-full justify-evenly items-center flex">
                {loading ? (
                    // Circular progress indicator
                    <View className="flex items-center justify-center h-full">
                        <ActivityIndicator size="large" />
                        <Text className="text-white text-lg mt-4">Loading...</Text>
                    </View>
                ) : routines.length === 0 ? (
                    <View className="flex items-center justify-center h-full">
                        <Text className="text-white text-3xl text-center mb-4">
                            You haven’t created any routines.
                        </Text>
                        <TouchableOpacity
                            className="bg-blue-600 py-3 px-4 rounded-full w-1/2 flex flex-row items-center justify-center"
                            onPress={() => setModalVisible(true)}
                        >
                            <Text className="text-white text-lg text-center">Create routine</Text>
                            <MaterialIcons name="add" size={30} color="white" className="mr-2" />

                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View className='flex flex-row items-center justify-between w-full m-2 mb-6'>
                            <TouchableOpacity
                                className="bg-blue-600 py-3 px-4 rounded-full w-1/2 flex flex-row items-center justify-center"
                                onPress={() => setModalVisible(true)}
                            >
                                <Text className="text-white text-lg text-center">Create routine</Text>
                                <MaterialIcons name="add" size={30} color="white" className="mr-2" />
                            </TouchableOpacity>
                            <Text className='text-blue-600 font-medium text-xl' onPress={() => setEditMode(!editMode)}>
                                {editMode ? "Cancel" : "Edit"} 
                            </Text>
                        </View>
                        <ScrollView className="w-full">
                            {routines.map((routine) => (
                                <TouchableOpacity key={routine.id} onPress={() => navigation.navigate('Routine', { routine: routine })}>
                                    <Divider />
                                    <View className="flex flex-row items-center justify-between">
                                        <Text className="text-white text-xl text-left p-4">{routine.name}</Text>
                                        {editMode && <MaterialIcons name="delete" size={30} color="white" className="mr-2" onPress={() => handleDelete(routine.id)} />}
                                    </View>
                                    <Divider />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                    </>
                )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                    <CreateRoutine navigation={navigation} setModalVisible={setModalVisible} ></CreateRoutine>
            </Modal>
            </View>

        </View>
    );
};

export default HomeScreen;

