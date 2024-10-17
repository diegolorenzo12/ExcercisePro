import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type ProfileScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Profile'>;
};


const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
    const { signOut } = useAuthenticator();
    return (
        <View className="flex-1 justify-center items-center bg-black">
            <Text className="text-2xl text-white font-bold">Profile Screen</Text>
            <TouchableOpacity
                className="mt-4 bg-blue-500 py-2 px-4 rounded"
                onPress={signOut}
            >
                <Text className="text-white">Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;
