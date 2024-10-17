import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type CreateRoutineProps = {
    navigation: StackNavigationProp<RootStackParamList, 'CreateRoutine'>;
};


const client = generateClient<Schema>()


export default function CreateRoutine({ navigation }: CreateRoutineProps) {
    const [routineName, setRoutineName] = useState<string>('')

    const createNewRoutine = async () => {
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
            const routine = {
                id: newRoutine.id,
                name: newRoutine.name,
                exercises: [],
                createdAt: newRoutine.createdAt,
                updatedAt: newRoutine.updatedAt,
                owner: newRoutine.owner || ''
            }

            console.log('Routine Created:', newRoutine)
            navigation.navigate('Routine', { routine: routine });
        } catch (error) {
            console.error('Error creating routine:', error)
        }
    }

    return (
        <View className="bg-black h-full justify-center items-center">
            <View className="bg-gray-800 rounded-lg h-3/4 w-full mx-6 justify-evenly items-center">
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
                        className="bg-blue-600 py-3 rounded-full w-1/3"
                        onPress={createNewRoutine} // Call createNewRoutine on press
                    >
                        <Text className="text-white text-lg text-center">Create</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-red-500 py-3 rounded-full w-1/3"
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text className="text-white text-lg text-center">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
