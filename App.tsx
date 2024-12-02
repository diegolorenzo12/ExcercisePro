import React from "react";
import { View, SafeAreaView, StatusBar } from "react-native";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import AppNavigator from "./src/navigation/AppNavigator";
import { LogBox } from 'react-native';


LogBox.ignoreAllLogs(true);
Amplify.configure(outputs);

const App = () => {
    return (
        <View className="h-full bg-black">
            <Authenticator.Provider>
                <Authenticator>
                    <StatusBar barStyle="light-content" backgroundColor="black" />
                    <SafeAreaView className="h-full">
                        <AppNavigator />
                    </SafeAreaView>
                </Authenticator>
            </Authenticator.Provider>
        </View>
    );
};


export default App;