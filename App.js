
import React from 'react';
// import type {Node} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import Profile from "./pages/Profile.js"
import Home from "./pages/Home.js"
import Goniometer from "./pages/Goniometer.js"
import SitStand from "./pages/SitStand.js"
import HomeScreen from "./pages/HomeScreen.js"
import HomePage from "./pages/HomePage.js"
import ViewAllUser from "./pages/ViewAllUser.js"
import FlexionChart from "./pages/FlexionChart.js"
import SitStandFormSG from "./pages/SitStandFormSG.js"
import GoniometerFormSG from "./pages/GoniometerFormSG.js"

import SQLite from 'react-native-sqlite-storage';




import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  AppRegistry,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Stack = createStackNavigator();

global.db = SQLite.openDatabase(
  {
    name: 'SQLite',
    location: 'default',
    createFromLocation: '~SQLite.db',
  },
  () => { },
  error => {
    console.log("ERROR: " + error);
  }
);



const App = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={({ navigation, route }) => ({
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => navigation.navigate('Home')}
              />
            ),
          })}
        />
        <Stack.Screen name="Goniometer" component={Goniometer} />
        <Stack.Screen name="SitStand" component={SitStand} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="ViewAllUser" component={ViewAllUser} />
        <Stack.Screen name="FlexionChart" component={FlexionChart} />
        <Stack.Screen name="SitStandFormSG" component={SitStandFormSG} />
        <Stack.Screen name="GoniometerFormSG" component={GoniometerFormSG} />



      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
