
import React, { useState, useEffect } from 'react';
// import type {Node} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from "./Profile.js"
import { openDatabase } from 'react-native-sqlite-storage';
import { Dimensions } from 'react-native';
import { useIsFocused } from "@react-navigation/native";


import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';



const Stack = createStackNavigator();
var db = openDatabase({ name: 'userDb.db' });


const appFunctions = [
    {
        id: 1,
        title: "Goniometer",
        navi: "Goniometer",
        image: "https://img.icons8.com/ios/50/000000/knee-joint.png",
    },
    {
        id: 2,
        title: "Sit-Stand",
        navi: "SitStand",
        image: "https://img.icons8.com/ios/50/000000/waiting-room.png",

    },
    // {
    //     id: 3,
    //     title: "Data",
    //     navi: "Data",
    //     image: "https://img.icons8.com/dotty/80/000000/activity-history.png",
    // },
    {
        id: 3,
        title: "Profile",
        title2: "Register User",
        navi: "Profile",
        navi2: "RegisterUser",
        image: "https://img.icons8.com/dotty/80/000000/activity-history.png",
    },
    {
        id: 4,
        title: "Guide",
        navi: "Guide",
        image: "https://img.icons8.com/ios/50/000000/city-guide.png"
    },
    {
        id: 5,
        title: "Contact Us",
        navi: "HomeScreen",
        image: "https://img.icons8.com/ios/50/000000/phone-disconnected.png",
    },
]



const Home = ({ navigation }) => {
    let [acc, setAcc] = useState(false)

    let resetUserDb = () => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE table_user')
            setAcc(false)
            console.log("success")
        })
    }
    let resetDateDb = () => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE table_allDate')
            console.log("success")
        })
    }
    let resetSitStandDb = () => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE table_sitStand')
            console.log("success")
        })
    }
    let resetExtensionDb = () => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE table_extension')
            console.log("success")
        })
    }
    let resetFlexionDb = () => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE table_flexion')
            console.log("success")
        })
    }


    const isFocused = useIsFocused()
    // resetUserDb()
    useEffect(() => {
        if (isFocused) {
            db.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
                    [],
                    function (tx, res) {
                        console.log('Useritem:', res.rows.length);
                        if (res.rows.length == 0) {
                            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
                            txn.executeSql(
                                'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), nric VARCHAR(10), gender VARCHAR(10), surgeryDate VARCHAR(20))',
                                [],
                            );
                        } else {
                            console.log("Account REGISTERED")

                            setAcc(true)
                        }
                    },
                );
            });
            db.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='table_allDate'",
                    [],
                    function (tx, res) {
                        console.log('Dateitem:', res.rows.length);
                        if (res.rows.length == 0) {
                            txn.executeSql('DROP TABLE IF EXISTS table_allDate', []);
                            txn.executeSql(
                                'CREATE TABLE IF NOT EXISTS table_allDate(date_id INTEGER PRIMARY KEY AUTOINCREMENT, date VARCHAR(20))',
                                [],
                            );
                        } else {
                            console.log("no")
                        }
                    },
                );
            });
            db.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='table_sitStand'",
                    [],
                    function (tx, res) {
                        console.log('Dateitem:', res.rows.length);
                        if (res.rows.length == 0) {
                            txn.executeSql('DROP TABLE IF EXISTS table_sitStand', []);
                            txn.executeSql(
                                'CREATE TABLE IF NOT EXISTS table_sitStand(sitStand_id INTEGER PRIMARY KEY AUTOINCREMENT, time VARCHAR(20), date VARCHAR(20))',
                                [],
                            );
                        } else {
                            console.log("no")
                        }
                    },
                );
            });
            db.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='table_flexion'",
                    [],
                    function (tx, res) {
                        console.log('Dateitem:', res.rows.length);
                        if (res.rows.length == 0) {
                            txn.executeSql('DROP TABLE IF EXISTS table_flexion', []);
                            txn.executeSql(
                                'CREATE TABLE IF NOT EXISTS table_flexion(flexion_id INTEGER PRIMARY KEY AUTOINCREMENT, degree VARCHAR(20), date VARCHAR(20))',
                                [],
                            );
                        } else {
                            console.log("no")
                        }
                    },
                );
            });
            db.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='table_extension'",
                    [],
                    function (tx, res) {
                        console.log('Dateitem:', res.rows.length);
                        if (res.rows.length == 0) {
                            txn.executeSql('DROP TABLE IF EXISTS table_extension', []);
                            txn.executeSql(
                                'CREATE TABLE IF NOT EXISTS table_extension(extension_id INTEGER PRIMARY KEY AUTOINCREMENT, degree VARCHAR(20), date VARCHAR(20))',
                                [],
                            );
                        } else {
                            console.log("no")
                        }
                    },
                );
            });
        }
    }, [isFocused]);

    let listButtons = () => {
        return (
            <FlatList
                data={appFunctions}
                renderItem={({ item }) =>
                    <View>
                        <View style={styles.boxContainer}>
                            <TouchableOpacity style={styles.buttonContainer} onPress={() => { navigation.navigate(item.navi) }}>
                                <Image style={styles.logoContainer} source={{ uri: item.image }} resizeMode='contain'></Image>
                                <Text style={styles.buttonHeader}>{item.title}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                keyExtractor={(item) => item.id}
                numColumns={2}
            >
            </FlatList>
        )
    }
    console.log(acc)


    return (

        <View>

            <View style={styles.homeContainer}>
                <Text style={styles.header}>Mo-Knee-Tor</Text>
                <Button title="reset all tables" onPress={() => {
                    setAcc(false)
                    resetUserDb()
                    resetDateDb()
                    resetSitStandDb()
                    resetFlexionDb()
                    resetExtensionDb()
                }}></Button>

                {acc == true ?
                    listButtons()
                    :
                    <FlatList
                        data={appFunctions}
                        renderItem={({ item }) =>
                            <View>


                                {(acc == false && item.id == 3) ? (
                                    <View style={styles.boxContainer}>
                                        <TouchableOpacity style={styles.buttonContainer} onPress={() => { navigation.navigate(item.navi2) }}>
                                            <Image style={styles.logoContainer} source={{ uri: item.image }} resizeMode='contain'></Image>
                                            <Text style={styles.buttonHeader}>{item.title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.boxContainer}>
                                        <TouchableOpacity style={styles.buttonContainer} onPress={() => { navigation.navigate(item.navi) }}>
                                            <Image style={styles.logoContainer} source={{ uri: item.image }} resizeMode='contain'></Image>
                                            <Text style={styles.buttonHeader}>{item.title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                            </View>
                        }
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                    >
                    </FlatList>
                }
            </View>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    boxContainer: {
        borderRadius: 20,
        height: windowHeight * 0.25,
        width: windowWidth * 0.45,
        backgroundColor: "lightblue",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        margin: 5,
    },
    logoContainer: {
        borderRadius: 20,
        height: windowHeight * 0.12,
        width: windowWidth * 0.25,
        // backgroundColor: "rgba(211,211,211, 0.3)",

    },
    header: {
        paddingTop: 10,
        textAlign: "center",
        fontSize: 40,
        fontWeight: "bold",
    },
    buttonHeader: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        // backgroundColor: "yellow"
    },
    buttonContainer: {
        alignItems: "center",
    },
    homeContainer: {
        alignItems: "center",
    },

});
export default Home

