import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import RoutineScreen from '../screens/RoutineScreen'; // Import the new screen
import ProfileScreen from '../screens/ProfileScreen';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons'; // Import from @expo/vector-icons
import CreateRoutine from '../screens/CreateRoutine';
import AddExercise from '../screens/AddExercise';
import ExerciseDetails from '../screens/ExerciseDetails';
import { RootStackParamList } from './types';
import ExerciseEdit from '../screens/EditExerciseDetails';
import { RoutineScreenProps } from '../screens/RoutineScreen';



type ProfileButtonNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

// const Stack = createNativeStackNavigator();

const Stack = createNativeStackNavigator<RootStackParamList>();


const ProfileButton = () => {
    const navigation = useNavigation<ProfileButtonNavigationProp>(); // Specify the navigation type

    return (
        <View className="flex flex-row items-start px-10 py-3">
            <FontAwesome name="user-circle" size={40} color="#fff" onPress={() => navigation.navigate('Profile')} />
            <Text className="text-white w-full px-5 text-4xl items-end text-right">
                ExercisePro
            </Text>
        </View>
    );
};
const AppNavigator = () => {
    return (
        <NavigationContainer >
            <ProfileButton />
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Routine" component={RoutineScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                {/* <Stack.Screen name="CreateRoutine" component={CreateRoutine} /> */}
                <Stack.Screen name="AddExercise" component={AddExercise} />
                <Stack.Screen name="ExerciseDetails" component={ExerciseDetails} />
                <Stack.Screen name="EditExercise" component={ExerciseEdit} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
