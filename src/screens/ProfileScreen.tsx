import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type ProfileScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
    const { signOut, user } = useAuthenticator();
    

    return (
        <View className="flex-1 bg-gray-900 justify-center items-center p-4">
            {/* Profile Picture */}
            <Image
                source={{
                    uri: user?.attributes?.picture || 'https://www.w3schools.com/w3images/avatar2.png',
                }}
                className="w-32 h-32 rounded-full mb-4"
            />
            {/* Profile Name */}
            <Text className="text-lg text-gray-400 mb-6">{user?.signInDetails?.loginId || 'No email provided'}</Text>
            {/* Sign Out Button */}
            <TouchableOpacity
                className="w-full bg-blue-600 py-3 rounded-lg mb-3"
                onPress={signOut}
            >
                <Text className="text-center text-white text-lg">Sign Out</Text>
            </TouchableOpacity>          
        </View>
    );
};

export default ProfileScreen;
