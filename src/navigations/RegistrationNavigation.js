import React from "react";
import { Text, View } from "react-native";

import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { Home } from "../home/Home";
import { SignUpScreen } from "../Registration/screens/SignUpScreen";
import { SignInScreen } from "../Registration/screens/SignInScreen";
import { AccountScreen } from "../Registration/screens/AccountScreen";

const Stack = createStackNavigator();
const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export const RegistrationNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.ModalPresentationIOS,
        headerShown: false,
        cardStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <Stack.Screen name="WelcomeScreen" component={AccountScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="signInScreen" component={SignInScreen} />
    </Stack.Navigator>
  );
};
