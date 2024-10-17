import React from "react";
import { View, SafeAreaView, StatusBar } from "react-native";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import AppNavigator from "./src/navigation/AppNavigator";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


Amplify.configure(outputs);

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="bg-black h-full">
                <Authenticator.Provider>
                    <Authenticator>
                        <StatusBar barStyle="light-content" backgroundColor="black" />
                        <SafeAreaView className="h-full">
                            <AppNavigator />
                        </SafeAreaView>
                    </Authenticator>
                </Authenticator.Provider>
            </View>
        </GestureHandlerRootView>
    );
};


export default App;