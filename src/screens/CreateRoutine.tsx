import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';


const client = generateClient<Schema>()


type CreateRoutineProps = {
    navigation: StackNavigationProp<RootStackParamList, "Home">;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function CreateRoutine({ navigation, setModalVisible }: CreateRoutineProps) {
    const [routineName, setRoutineName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const createNewRoutine = async () => {
        setIsLoading(true)
        if (!routineName) {
            return
        }

        try {
            const { errors, data: newRoutine } = await client.models.Routine.create({
                name: routineName,
            })

            if (errors) {
                console.error("Failed to create routine:", errors)
                alert("Failed to create routine. Please try again.")
                return
            }

            if (!newRoutine) {
                console.error("Failed to create routine.")
                alert("Failed to create routine. Please try again.")
                return
            }


            console.log('Routine Created:', newRoutine)
            navigation.navigate('Routine', { routine: newRoutine });
        } catch (error) {
            console.error('Error creating routine:', error)
        }
        setIsLoading(false);
    }

    return (
        <View className="bg-black/[.5] h-full justify-center items-center px-2">
            <View className="bg-gray-800 rounded-lg h-1/2 w-full mx-6 justify-evenly items-center">
                <Text className="text-white text-3xl text-center mb-4">
                    Create a Routine
                </Text>
                <TextInput
                    className="text-white text-lg text-center mb-4 border-b border-white w-full"
                    placeholder="Routine Name"
                    placeholderTextColor="#ccc"
                    value={routineName}
                    onChangeText={setRoutineName} // Update routine name on input change
                />
                <View className="flex flex-row justify-evenly items-center w-full">
                    <TouchableOpacity
                        className="bg-red-500 py-3 rounded-full w-1/3"
                        onPress={() => setModalVisible(false)}
                    >
                        <Text className="text-white text-lg text-center">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={createNewRoutine} // Call createNewRoutine on press
                        disabled={isLoading}
                        className={`${isLoading ? 'bg-gray-400' : 'bg-blue-600'
                            } py-3 rounded-full w-1/3`}
                    >
                        <Text className="text-white text-lg text-center">Create</Text>
                    </TouchableOpacity>                   
                </View>
            </View>
        </View>
    )
}
