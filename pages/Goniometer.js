
import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import { DeviceMotion } from "expo-sensors";
import { Dimensions } from 'react-native';
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
    Image,
    FlatList,
} from 'react-native';
import {
    accelerometer,
    gyroscope,
    setUpdateIntervalForType,
    SensorTypes
} from "react-native-sensors";
var db = openDatabase({ name: 'userDb.db' });
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Goniometer = ({ navigation, route }) => {
    setUpdateIntervalForType(SensorTypes.gyroscope, 100);
    const [firstDate, setFirstDate] = useState("")
    const [shouldShow, setShouldShow] = useState(true);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedGenderValue, setSelectedGenderValue] = useState(null);
    const [extensionDegree, setExtensionDegree] = useState("0");
    const [flexionDegree, setFlexionDegree] = useState("0");
    const [extensionDegreeControl, setExtensionDegreeControl] = useState("Pending");
    const [flexionDegreeControl, setFlexionDegreeControl] = useState("Pending");

    function round(n) {
        if (!n) {
            return 0;
        }
        return Math.floor(n * 100) / 100;
    }
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
                setFirstDate(results.rows.item(0).surgeryDate)
                setSelectedGenderValue(results.rows.item(0).gender)
                console.log(esults.rows.item(0).gender)
            });
        });
    }, []);
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
    let setFlexionToDatabase = (degree) => {
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
            console.log(degree + "wo")
            tx.executeSql(
                'INSERT INTO table_flexion (degree, date) VALUES (?,?)',
                [degree.toString(), formattedDate],
                (tx, results) => {
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
                        // alert('Registration Failed');
                    }
                },
            );
        })
    }
    let setExtensionToDatabase = (degree) => {
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
                [degree.toString(), formattedDate],
                (tx, results) => {
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
                        // alert('Registration Failed');
                    }
                },
            );
        })
    }
    const [data, setData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const _subscribe = () => {
        setSubscription(
            DeviceMotion.addListener(({ rotation }) => {
                setData(rotation);
            })
        );
    };
    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };
    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);
    const { alpha, beta, gamma } = data;
    var currentDate = new Date()
    var timeDifference;
    if (firstDate.length != 0) {
        timeDifference = currentDate.getTime() - Date.parse(firstDate)
    } else {
        timeDifference = 0
    }
    var dayDiff = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    function noGenderWeek(n) {
        if (selectedGenderValue === "") {
            return true;
        }
        return false;
    }
    //green function to indicate above 75th Percentile
    function green(n) {
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
    function blue(n) {
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
    function red(n) {
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
    function belowRed(n) {
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
    const submitAlert = () => {
        Alert.alert("Are you sure you want to submit?", "", [
            {
                text: "Cancel",
                onPress: () => console.log("submitted"),
                style: "cancel",
            },
            {
                text: "Yes",
                onPress: () =>
                    navigation.navigate("GoniometerFormSG", {
                        flexionData: flexionDegree,
                        extensionData: extensionDegree,
                        name: "GoniometerFormSG",
                        flex: 1,
                    }),
            },
        ]);
    };
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
    function setDegreeValues(sign, beta) {
        if (sign == "flexion") {
            console.log(getDegrees(round(beta)))
            var degr = getDegrees(round(beta));
            // add(degr);
            setFlexionDegree(getDegrees(round(beta)))
            // console.log(flexionDegree)
            // setTimeout(function () {
            setFlexionToDatabase(getDegrees(round(beta)))
            // }, 1000)
            setFlexionDegreeControl("Done");
            // setVal(degr);
        } else {
            var a = getDegrees(round(beta));
            // add1(a);
            setExtensionDegree(getDegrees(round(beta)));
            setExtensionToDatabase(getDegrees(round(beta)))
            setExtensionDegreeControl("Done");
            // setVals(a);
        }
    }
    return (
        <View style={styles.container}>
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
                    {noGenderWeek(getDegrees(round(beta))) ? (
                        <Text style={stylePercentile.textPercentileBlack}>
                            {getDegrees(round(beta))}°
                        </Text>
                    ) : null}
                    {green(getDegrees(round(beta))) ? (
                        <Text style={stylePercentile.textPercentileGreen}>
                            {getDegrees(round(beta))}°
                        </Text>
                    ) : null}
                    {blue(getDegrees(round(beta))) ? (
                        <Text style={stylePercentile.textPercentileOrange}>
                            {getDegrees(round(beta))}°
                        </Text>
                    ) : null}
                    {red(getDegrees(round(beta))) ? (
                        <Text style={stylePercentile.textPercentileOrange}>
                            {getDegrees(round(beta))}°
                        </Text>
                    ) : null}
                    {belowRed(getDegrees(round(beta))) ? (
                        <Text style={stylePercentile.textPercentileRed}>
                            {getDegrees(round(beta))}°
                        </Text>
                    ) : null}
                </View>
            ) : null}
            {shouldShow ? (
                <View>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 30,
                            fontStyle: "italic",
                        }}
                    >
                        Previous Extension: {extensionDegree}°
            </Text>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 30,
                            fontStyle: "italic",
                        }}
                    >
                        Previous Flexion: {flexionDegree}°
            </Text>
                </View>
            ) : null}
            {!shouldShow ? (
                <View>
                    <Text></Text>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 30,
                            fontStyle: "italic",
                        }}
                    >
                        Extension: {extensionDegreeControl}
                    </Text>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 30,
                            fontStyle: "italic",
                        }}
                    >
                        Flexion: {flexionDegreeControl}
                    </Text>
                </View>
            ) : null}

            <ScrollView>

                <FlatList
                    data={kneeFunctions}
                    renderItem={({ item }) =>
                        <View>
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
                <View style={styles.MainRecordContainer}>
                    {!(flexionDegree != 0 && extensionDegree != 0) ? <Text></Text> : null}
                    {flexionDegree != 0 && extensionDegree != 0 ? (
                        <TouchableOpacity
                            style={styles.SubmitButtonFormStyle}
                            onPress={submitAlert}
                        >
                            <Text style={styles.TextStyleButton}>Submit FormSG</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
};

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
}
const styles = StyleSheet.create({
    TextStyleButton: {
        color: "#fff",
        textAlign: "center",
        fontSize: 40,
    },
    SubmitButtonFormStyle: {
        backgroundColor: "#2b2e6d",
        borderRadius: 35,
        // alignItems: "center",
        // borderWidth: 1,
        borderColor: "#fff",
        width: windowWidth * 0.9,
        height: windowHeight * 0.1,
        justifyContent: "center",
    },
    MainRecordContainer: {
        alignItems: "center",
        // backgroundColor: "yellow",
    },
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
        alignItems: "center",
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
        // elevation: 12,
        marginVertical: 20,
        backgroundColor: "rgba(161,221,239,0.4)",
        height: 200,
        width: windowWidth * 0.9,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    previousReadingsTitle: {
        textAlign: "center",
        fontSize: 30,
        fontStyle: "italic",
    },
    SubmitButtonStyle: {
        backgroundColor: "#2b2e6d",
        borderRadius: 35,
        borderWidth: 1,
        borderColor: "#fff",
        height: 120,
        justifyContent: "center",
    },

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