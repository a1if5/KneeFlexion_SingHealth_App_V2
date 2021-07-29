
import React, { useState, useEffect } from 'react';
// import type {Node} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from "./Profile.js"
import Kfke from "../kfke.js"
import { openDatabase } from 'react-native-sqlite-storage';
import kf from "../kf.png"

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
    Alert,
} from 'react-native';
const Stack = createStackNavigator();
const kneeFunctions = [
    {
        id: 1,
        title: "Record Extension",
        image: require("../ke.png"),
        sign: "extension"
    },
    {
        id: 2,
        title: "Record Flexion",
        image: require("../kf.png"),
        sign: "flexion"

    },
]

var db = openDatabase({ name: 'userDb.db' });

const Goniometer = ({ navigation }) => {
    const [firstDate, setFirstDate] = useState("")
    const [extensionDegree, setExtensionDegree] = useState("0");
    const [selectedGenderValue, setSelectedGenderValue] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [extensionDegreeControl, setExtensionDegreeControl] = useState("Pending");
    const [flexionDegreeControl, setFlexionDegreeControl] = useState("Pending");

    const [flexionDegree, setFlexionDegree] = useState("0");
    const [shouldShow, setShouldShow] = useState(true);
    const [data, setData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });
    const { alpha, beta, gamma } = data;
    // function displayAngle() {
    //     setSelectedGenderValue("Male")
    // }

    function setDegreeValues(sign, beta) {
        if (sign == "flexion") {
            var degr = getDegrees(round(beta));
            // add(degr);
            setFlexionDegree(getDegrees(round(beta)));
            setFlexionToDatabase(flexionDegree)
            setFlexionDegreeControl("Done");
            // setVal(degr);
        } else {
            var a = getDegrees(round(beta));
            // add1(a);
            setExtensionDegree(getDegrees(round(beta)));
            setExtensionToDatabase(extensionDegree)
            setExtensionDegreeControl("Done");
            // setVals(a);
        }
    }
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
                setFirstDate(results.rows.item(0).surgeryDate)
                setSelectedGenderValue(results.rows.item(0).gender)
                console.log(selectedGenderValue)
                console.log(firstDate)
            });
        });
    }, []);

    var timeDiff = new Date().getTime() - new Date(firstDate).getTime()
    dayDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));


    console.log(dayDiff)

    function round(n) {
        if (!n) {
            return 0;
        }
        return Math.floor(n * 100) / 100;
    }
    function getDegrees(n) {
        if (!n) {
            return 0;
        }
        var pitchraw2 = Math.abs(radians_to_degrees(n));
        var pitchtrig = Math.acos(Math.sin(n) / 1.2);
        var pitch = Math.round(90 + pitchraw2 - radians_to_degrees(pitchtrig));
        return pitch;
    }
    function radians_to_degrees(radians) {
        var pi = Math.PI;
        return radians * (180 / pi);
    }
    function noGenderWeek(n, selectedGenderValue, selectedValue) {
        if (selectedGenderValue === "" || selectedValue === "") {
            return true;
        }
        return false;
    }
    function green(n, selectedGenderValue) {
        if (selectedGenderValue === "male") {
            if (
                (n >= 112 && dayDiff <= 14) ||
                (n >= 115 && (dayDiff > 14) & (dayDiff <= 28)) ||
                (n >= 117 && (dayDiff > 28) & (dayDiff <= 42)) ||
                (n >= 120 && (dayDiff > 42) & (dayDiff <= 56)) ||
                (n >= 121 && (dayDiff > 56) & (dayDiff <= 70)) ||
                (n >= 123 && (dayDiff > 70) & (dayDiff <= 84))
            ) {
                return true;
            }
        } else if (selectedGenderValue === "female") {
            if (
                (n >= 105 && dayDiff <= 14) ||
                (n >= 110 && (dayDiff > 14) & (dayDiff <= 28)) ||
                (n >= 115 && (dayDiff > 28) & (dayDiff <= 42)) ||
                (n >= 117 && (dayDiff > 42) & (dayDiff <= 56)) ||
                (n >= 118 && (dayDiff > 56) & (dayDiff <= 70)) ||
                (n >= 120 && (dayDiff > 70) & (dayDiff <= 84))
            ) {
                return true;
            }
        }

        return false;
    }
    //blue function to decide if 75th to 50th percentile
    function blue(n, selectedGenderValue) {
        if (selectedGenderValue === "male") {
            if (
                (n < 112 && n >= 101 && dayDiff <= 14) ||
                (n < 115 && n >= 106 && (dayDiff > 14) & (dayDiff <= 28)) ||
                (n < 117 && n >= 110 && (dayDiff > 28) & (dayDiff <= 42)) ||
                (n < 120 && n >= 113 && (dayDiff > 42) & (dayDiff <= 56)) ||
                (n < 121 && n >= 115 && (dayDiff > 56) & (dayDiff <= 70)) ||
                (n < 123 && n >= 117 && (dayDiff > 70) & (dayDiff <= 84))
            ) {
                return true;
            }
        } else if (selectedGenderValue === "female") {
            if (
                (n < 105 && n >= 95 && dayDiff <= 14) ||
                (n < 110 && n >= 102 && (dayDiff > 14) & (dayDiff <= 28)) ||
                (n < 115 && n >= 106 && (dayDiff > 28) & (dayDiff <= 42)) ||
                (n < 117 && n >= 109 && (dayDiff > 42) & (dayDiff <= 56)) ||
                (n < 118 && n >= 110 && (dayDiff > 56) & (dayDiff <= 70)) ||
                (n < 120 && n >= 110 && (dayDiff > 70) & (dayDiff <= 84))
            ) {
                return true;
            }
        }

        return false;
    }
    //red function to decide if 50th to 25th percentile
    function red(n, selectedGenderValue) {
        if (selectedGenderValue === "male") {
            if (
                (n > 90 && n < 101 && dayDiff <= 14) ||
                (n > 96 && n < 106 && (dayDiff > 14) & (dayDiff <= 28)) ||
                (n > 102 && n < 110 && (dayDiff > 28) & (dayDiff <= 42)) ||
                (n > 105 && n < 113 && (dayDiff > 42) & (dayDiff <= 56)) ||
                (n > 106 && n < 115 && (dayDiff > 56) & (dayDiff <= 70)) ||
                (n > 107 && n < 117 && (dayDiff > 70) & (dayDiff <= 84))
            ) {
                return true;
            }
        } else if (selectedGenderValue === "female") {
            if (
                (n > 88 && n < 95 && dayDiff <= 14) ||
                (n > 93 && n < 102 && (dayDiff > 14) & (dayDiff <= 28)) ||
                (n > 96 && n < 106 && (dayDiff > 28) & (dayDiff <= 42)) ||
                (n > 99 && n < 109 && (dayDiff > 42) & (dayDiff <= 56)) ||
                (n > 101 && n < 110 && (dayDiff > 56) & (dayDiff <= 70)) ||
                (n > 103 && n < 110 && (dayDiff > 70) & (dayDiff <= 84))
            ) {
                return true;
            }
        }

        return false;
    }
    //red function to decide if 25th percentile and below
    function belowRed(n, selectedGenderValue) {
        if (selectedGenderValue === "male") {
            if (
                (n <= 90 && dayDiff <= 14) ||
                (n <= 96 && (dayDiff > 14) & (dayDiff <= 28)) ||
                (n <= 102 && (dayDiff > 28) & (dayDiff <= 42)) ||
                (n <= 105 && (dayDiff > 42) & (dayDiff <= 56)) ||
                (n <= 106 && (dayDiff > 56) & (dayDiff <= 70)) ||
                (n <= 107 && (dayDiff > 70) & (dayDiff <= 84))
            ) {
                return true;
            }
        } else if (selectedGenderValue === "female") {
            if (
                (n <= 88 && dayDiff <= 14) ||
                (n <= 93 && (dayDiff > 14) & (dayDiff <= 28)) ||
                (n <= 96 && (dayDiff > 28) & (dayDiff <= 42)) ||
                (n <= 99 && (dayDiff > 42) & (dayDiff <= 56)) ||
                (n <= 101 && (dayDiff > 56) & (dayDiff <= 70)) ||
                (n <= 103 && (dayDiff > 70) & (dayDiff <= 84))
            ) {
                return true;
            }
        }
        return false;
    }


    let setFlexionToDatabase = () => {
        var todayDate = new Date();
        var month = parseInt(todayDate.getMonth() + 1).toString()
        var day = todayDate.getDate().toString()
        if (month.length == 1) {
            month = "0" + month
        }
        if (day.length == 1) {
            day = "0" + day
        }
        var formattedDate = todayDate.getFullYear() + "-" + month + "-" + day
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO table_flexion (degree, date) VALUES (?,?)',
                [flexionDegree.toString(), formattedDate],
                (tx, results) => {
                    console.log('Results11', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        Alert.alert(
                            'Success',
                            'Flexion Recorded!',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.navigate(''),
                                },
                            ],
                            { cancelable: false },
                        );
                    } else {
                        alert('Registration Failed');
                    }
                },
            );
        })
    }
    let setExtensionToDatabase = () => {
        var todayDate = new Date();
        var month = parseInt(todayDate.getMonth() + 1).toString()
        var day = todayDate.getDate().toString()
        if (month.length == 1) {
            month = "0" + month
        }
        if (day.length == 1) {
            day = "0" + day
        }
        var formattedDate = todayDate.getFullYear() + "-" + month + "-" + day
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO table_extension (degree, date) VALUES (?,?)',
                [extensionDegree.toString(), formattedDate],
                (tx, results) => {
                    console.log('Extension Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        Alert.alert(
                            'Success',
                            'Extension Recorded!',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.navigate(''),
                                },
                            ],
                            { cancelable: false },
                        );
                    } else {
                        alert('Registration Failed');
                    }
                },
            );
        })
    }


    var icons = require("../ke.png")
    return (
        <View>


            <View style={styles.homeContainer}>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => setShouldShow(!shouldShow)}
                        style={styles.ShowHideButtonStyle}
                    >
                        <Text style={styles.ShowHideTextButtonStyle}>
                            {shouldShow ? "Hide Display" : "Show Display"}
                        </Text>
                    </TouchableOpacity>
                </View>
                {shouldShow ? (
                    <View>
                        <Text style={{ textAlign: "center", fontSize: 45 }}>
                            Knee Range{" "}
                        </Text>
                        {noGenderWeek(getDegrees(round(beta)), selectedGenderValue, selectedValue) ? (
                            <Text style={stylePercentile.textPercentileBlack}>
                                {getDegrees(round(beta))}°
                            </Text>
                        ) : null}
                        {green(getDegrees(round(beta)), selectedGenderValue) ? (
                            <Text style={stylePercentile.textPercentileGreen}>
                                {getDegrees(round(beta))}°
                            </Text>
                        ) : null}
                        {blue(getDegrees(round(beta)), selectedGenderValue) ? (
                            <Text style={stylePercentile.textPercentileOrange}>
                                {getDegrees(round(beta))}°
                            </Text>
                        ) : null}
                        {red(getDegrees(round(beta)), selectedGenderValue) ? (
                            <Text style={stylePercentile.textPercentileOrange}>
                                {getDegrees(round(beta))}°
                            </Text>
                        ) : null}
                        {belowRed(getDegrees(round(beta)), selectedGenderValue) ? (
                            <Text style={stylePercentile.textPercentileRed}>
                                {getDegrees(round(beta))}°
                            </Text>
                        ) : null}
                    </View>
                ) : null}
                {/* <View>
                    {useEffect(() => {
                        displayAngle();
                    }, [])}
                </View> */}
                <View>
                    <Text style={styles.previousReadingsTitle}>Previous Extension: {extensionDegree}° </Text>
                    <Text style={styles.previousReadingsTitle}>Previous Flexion: {flexionDegree}° </Text>
                </View>
                <FlatList
                    data={kneeFunctions}
                    renderItem={({ item }) =>
                        <View>
                            {/* <Button onPress={() => {
                                setDegreeValues(item.sign, beta)
                            }}
                                title="lol"></Button> */}
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={() => {
                                    setDegreeValues(item.sign, beta)
                                }}>
                                <Image style={styles.card} source={item.image} resizeMode='contain'></Image>
                            </TouchableOpacity>
                        </View>
                    }
                    keyExtractor={(item) => item.id}
                    numColumns={1}
                >
                </FlatList>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ShowHideButtonStyle: {
        marginTop: 10,
        backgroundColor: "#2b2e6d",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#fff",
        height: 25,
        //height: 50,
        width: "40%",
        justifyContent: "center",
        alignItems: "center",
    },
    ShowHideTextButtonStyle: {
        fontSize: 18,
        // fontSize: 25,
        color: "#fff",
        textAlign: "center",
        alignItems: "center",
    },
    logoContainer: {
        height: 200,
        width: 300,
        backgroundColor: "lightgray",
    },
    header: {
        paddingTop: 20,
        textAlign: "center",
        fontSize: 30,
    },
    buttonHeader: {
        textAlign: "center",
        fontSize: 20,
    },
    buttonContainer: {
        // alignContent: "space-between",
        // padding: 40,
        // backgroundColor: "yellow",

    },
    homeContainer: {
        alignItems: "center",
    },
    card: {
        shadowColor: "#474747",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        marginVertical: 20,
        backgroundColor: "rgba(161,221,239,0.4)",
        height: 200,
        width: 300,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    previousReadingsTitle: {
        textAlign: "center",
        fontSize: 30,
        fontStyle: "italic",
    }

});


const stylePercentile = StyleSheet.create({
    textPercentileBlack: {
        color: "black",
        textAlign: "center",
        fontSize: 90,
        paddingLeft: 20,
    },
    textPercentileGreen: {
        color: "green",
        textAlign: "center",
        fontSize: 90,
        paddingLeft: 20,
    },
    textPercentileOrange: {
        textAlign: "center",
        color: "#FFA537",
        fontSize: 90,
        paddingLeft: 20,
    },
    textPercentileRed: {
        color: "#FF8C00",
        textAlign: "center",
        fontSize: 90,
        paddingLeft: 20,
    },
});




export default Goniometer

