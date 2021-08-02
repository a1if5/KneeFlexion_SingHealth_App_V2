
import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {
    Dimensions, Image,
} from 'react-native';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
    Input,
    TextInput,
    TouchableOpacity,
    Touchable,
    Alert,
    FlatList,
} from 'react-native';
const genderArray = [{
    id: '1',
    label: 'Male',
    value: 'male'
}, {
    id: '2',
    label: 'Female',
    value: 'female'
}]
var db = openDatabase({ name: 'userDb.db' });

const Profile = ({ navigation }) => {


    return (
        <View style={styles.container}>
            <Image
                style={{
                    // display: "block",
                    // marginLeft: "auto",
                    // marginRight: "auto",
                }}
                source={require("../sgh-logo.png")}
            />
            <Text></Text>
            <Text></Text>
            <Text style={{ textAlign: "center", fontSize: 20 }}>
                General Enquiries: {"\n"}+65 6222 3322
    </Text>
            <Text></Text>
            <Text style={{ textAlign: "center", fontSize: 20 }}>
                Address: {"\n"}Outram Road Singapore 169608
    </Text>
        </View>







    )

}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
    },



})


export default Profile

