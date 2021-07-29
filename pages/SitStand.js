import { Stopwatch, Timer } from 'react-native-stopwatch-timer'
import React, { Component, useState } from 'react';
// import type {Node} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from "./Profile.js"
import { AppRegistry, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Button, Alert } from 'react-native';
// import Tts from 'react-native-tts';
import { openDatabase } from 'react-native-sqlite-storage';

import { Dimensions } from 'react-native';
import Tts from 'react-native-tts';



var db = openDatabase({ name: 'userDb.db' });
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
var buttonHeight = windowHeight * 0.8
var timerHeight = windowHeight * 0.12
var timerWidth = windowWidth


const SitStand = ({ navigation }) => {

    const [stopwatch, setStartStopwatch] = useState(false);
    const [reset, setReset] = useState(false);
    const [time, setTime] = useState(0)
    const [firstClick, setFirstClick] = useState(false)
    const [secondClick, setSecondClick] = useState(false)

    function countdown() {
        console.log("weeee")
        setTimeout(1000)
    }

    function startStopwatch() {
        if (firstClick == false) {
            Tts.speak('3.......... 2......... 1......... Start!');
            setTimeout(function () {
                setFirstClick(true)
                setStartStopwatch(!stopwatch)
                setReset(false)
            }, 2100

            )
        } else {
            if (firstClick == true) {
                setSecondClick(true)
            }
            if (stopwatch == false) {
                // speak()
            }
            setFirstClick(true)
            setStartStopwatch(!stopwatch)
            setReset(false)
        }
    }

    function resetStopwatch() {
        setStartStopwatch(false);
        setReset(true);
        setFirstClick(false)
        setSecondClick(false)
    }

    function getTiming(time) {
        setTime(time);
    }

    let setTimeToDatabase = () => {
        var splitTimeArr = time.split(":");
        seconds = +splitTimeArr[0] * 60 * 60 + +splitTimeArr[1] * 60 + +splitTimeArr[2];
        seconds = seconds + "." + splitTimeArr[3];
        seconds = seconds.toString()
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
                'INSERT INTO table_sitStand (time, date) VALUES (?,?)',
                [seconds, formattedDate],
                (tx, results) => {
                    console.log('sitStand Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Success',
                            'Time recorded',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.navigate('SitStandFormSG', {
                                        timeData: seconds,
                                    }),
                                },
                            ],
                            { cancelable: false },
                        );
                    } else {
                        alert('Registration Failed');
                    }
                },
            )
            console.log("success")
        })
    }

    // const speak = () => {
    //     var thingToSay = "3.......... 2......... 1......... Start"

    //     Speech.speak(thingToSay, {
    //         onDone: console.log(thingToSay),
    //         rate: 0.7,
    //     });
    // };
    // Tts.speak('Hello, world!');

    console.log(buttonHeight)
    return (
        <View>



            <Stopwatch
                laps
                hrs={false}
                msecs={true}
                start={stopwatch}
                reset={reset}
                options={options}
                getTime={getTiming}
                style={styles.timerStyle}
            />
            {secondClick == false ?
                <View style={styles.startstopbutton}>
                    <TouchableOpacity style={styles.rButton} onPress={startStopwatch}>
                        <Text style={{ fontSize: 30 }}>{!stopwatch ? "Start" : "Stop"}</Text>
                    </TouchableOpacity>
                </View>

                :
                <View></View>
            }
            {/* <View styles={styles.buttonContainer}> */}
            {/* {secondClick == true ?
                    <View styles={styles.startstopbutton}>
                        <TouchableHighlight onPress={resetStopwatch}>
                            <Text style={{ fontSize: 30 }}>Reset</Text>
                        </TouchableHighlight>
                    </View>
                    :
                    <Text></Text>

                } */}
            {
                secondClick == true ?



                    <View style={styles.buttonContainer}>
                        <View style={styles.startstopbutton}>
                            <TouchableOpacity style={styles.rButton} onPress={resetStopwatch}>
                                <Text style={{ fontSize: 30 }}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.submitButton}>
                            <TouchableOpacity style={styles.sButton} onPress={setTimeToDatabase}>

                                <Text style={{ fontSize: 30 }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    // <View style={styles.container}>
                    //     <Text>Helo</Text>
                    //     <View style={{ flex: 2, backgroundColor: "darkorange" }} />
                    //     <View style={{ flex: 3, backgroundColor: "green" }} />
                    // </View>
                    :
                    <View></View>
            }

        </View >
    )

}
const options = StyleSheet.create({

    container: {
        backgroundColor: '#000',
        padding: 5,
        // borderRadius: 5,
        alignItems: "center",
        width: timerWidth,
        height: timerHeight,
    },
    text: {
        fontSize: 50,
        alignItems: "center",
        color: '#FFF',
        // marginLeft: 7,
    }
});

const styles = StyleSheet.create({

    container: {
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex: 1,
        fontSize: 30,
        // paddingVertical: 100,


    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        // backgroundColor: "black",
    },
    rButton: {
        backgroundColor: "lightblue",
        alignItems: "center",
        height: buttonHeight,
        justifyContent: 'center',
    },
    sButton: {
        backgroundColor: "lightyellow",
        alignItems: "center",
        height: buttonHeight,
        justifyContent: 'center',


    },
    ssbutton: {
        backgroundColor: "lightblue",
        alignItems: "center",
        height: buttonHeight,
        justifyContent: 'center',
    },
    startstopbutton: {
        flex: 0.7,
        // backgroundColor: "lightblue",
        // alignItems: "center",
        // height: "100%",
    },
    submitButton: {
        flex: 0.3,
        // backgroundColor: "lightyellow",
        // alignItems: "center",
        // height: "100%",
    },
})



export default SitStand;