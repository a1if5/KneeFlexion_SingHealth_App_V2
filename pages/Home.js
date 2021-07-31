

import React, { useState, useEffect } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import DatePicker from 'react-native-date-picker'
import { Dimensions } from 'react-native';
import { useIsFocused } from "@react-navigation/native";

import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
    SafeAreaView,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Image,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import Mytextinput from './Mytextinput';
import Mybutton from './Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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


const RegisterUser = ({ navigation }) => {
    let [date, setDate] = useState(new Date())
    let [name, setName] = useState('')
    let [nric, setNric] = useState('')
    let [gender, setGender] = useState(genderArray)
    let [genderId, setGenderId] = useState('')
    let [acc, setAcc] = useState(false)
    let [flatListItems, setFlatListItems] = useState([]);
    let [showDatePicker, setShowDatePicker] = useState(false)
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



    function onPressRadioButton(g) {
        if (g[0].selected == true) {
            setGenderId("male")
        } else {
            setGenderId("female")
        }
        setGender(g);
    }


    let altScreen = () => {
        return (
            <View
                style={styles.sghcontainer}
                onTouchStart={() => navigation.navigate("HomePage")}
            >
                <Image
                    style={{
                        // display: "flex",
                        // marginLeft: "auto",
                        // marginRight: "auto",
                        resizeMode: "contain",
                        width: windowWidth * 0.9,
                        height: windowHeight * 0.1,
                        marginBottom: 50,
                    }}
                    source={require("../sgh-logo.png")}
                />
                {/* <Text></Text>
                <Text></Text> */}
                <Text
                    style={{
                        textAlign: "center",
                        fontSize: 40,
                        fontWeight: "bold",
                        fontStyle: "italic",
                    }}
                >
                    Mo-Knee-Tor
              </Text>
                <Text style={{ textAlign: "center", fontSize: 20 }}>
                    Created by {"\n"} Alif and Ismahfaris {"\n"}
                </Text>
            </View>
        );
    };
    let register_user = () => {
        var dateList = set84Dates()
        var month = parseInt(date.getMonth() + 1).toString()

        // console.log(dateList)
        var formatDate = date.getFullYear() + "/" + month + "/" + date.getDay()
        var formattedDate = new Date(formatDate)
        console.log(name, nric, genderId, formatDate);
        db.transaction(function (tx) {
            var formatDate = date.getFullYear() + "/" + month + "/" + date.getDate()
            tx.executeSql(
                'INSERT INTO table_user (name, nric, gender, surgeryDate) VALUES (?,?,?,?)',
                [name, nric, genderId, formatDate],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        setAcc(true)
                        Alert.alert(
                            'Success',
                            'You are Registered Successfully',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.navigate('HomePage'),
                                },
                            ],
                            { cancelable: false },
                        );
                    } else {
                        alert('Registration Failed');
                    }
                },
            );
            for (var i = 0; i < 84; i++) {
                // console.log(dateList[i])
                tx.executeSql(
                    'INSERT INTO table_allDate (date) VALUES (?)',
                    [dateList[i]],
                    (tx, results) => {
                        // console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                        } else {
                        }
                    },
                );
            }
        });
    }
    var month = (parseInt(date.getMonth()) + 1).toString()
    var day = (parseInt(date.getDate())).toString()
    var correctDate = date.getFullYear() + "/" + month + "/" + day
    var correctDateinDateFormat = new Date(correctDate)
    function set84Dates() {
        var dateList = []
        for (var i = 0; i < 84; i++) {
            var nextDay = new Date(date.getTime() + i * 24 * 60 * 60 * 1000);
            var nextDayFormat = nextDay.getFullYear() + "/" + nextDay.getMonth() + "/" + nextDay.getDate()
            // console.log(nextDay.getFullYear() + "/" + nextDay.getMonth() + "/" + nextDay.getDate())
            dateList.push(nextDayFormat)
        }
        return dateList
    }
    if (acc == false) {
        return (
            < View style={styles.overallContainer} >
                <Text style={styles.formHeader}>Name</Text>
                <TextInput
                    style={styles.formBox}
                    placeholder={"Name"}
                    onChangeText={name => setName(name)}
                    defaultValue={name}>
                </TextInput>
                <Text style={styles.formHeader}>NRIC</Text>
                <TextInput
                    style={styles.formBox}
                    placeholder={"Last 4 Digits"}
                    onChangeText={nric => setNric(nric)}
                    defaultValue={nric}>
                </TextInput>
                <Text style={styles.formHeader}>Gender</Text>
                <RadioGroup
                    radioButtons={gender}
                    onPress={onPressRadioButton}
                    layout="row"
                />
                <Text style={styles.formHeader}>Surgery Date</Text>

                <View style={styles.dateBox}>
                    <TouchableOpacity onPress={() => {
                        setShowDatePicker(true)
                    }}>
                        <Text style={{ fontSize: 30, textAlign: "center" }}>
                            {correctDate}
                        </Text>
                    </TouchableOpacity>

                </View>


                {showDatePicker == true ?
                    <DatePicker
                        style={styles.formBoxDate}
                        date={date}
                        mode={"date"}
                        onDateChange={setDate}
                    />
                    :
                    <View></View>
                }



                {/* <Text style={{ fontSize: 42 }}>
                {name}
            </Text> */}
                {/* <Text style={{ fontSize: 42 }}>
                {nric}
            </Text> */}
                {/* <Text style={{ fontSize: 42 }}>
                {date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}
            </Text> */}
                {/* <Text style={{ fontSize: 42 }}>
                {correctDateinDateFormat.getDate()}
                {correctDateinDateFormat.getMonth()}
                {correctDateinDateFormat.getFullYear()}
            </Text> */}
                {/* <Text style={{ fontSize: 42 }}>
                {(new Date(date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate())).getDate()}
                {(new Date(date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate())).getMonth()}
                {(new Date(date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate())).getFullYear()}
            </Text> */}
                <Text style={{ fontSize: 42 }}>
                    {genderId}
                </Text>
                {/* <Button style={styles.submitButtonFormStyle} onPress={register_user} title="Register" color></Button> */}
                <TouchableOpacity style={styles.submitButtonFormStyle} onPress={register_user}><Text style={styles.textStyleButton}>Register</Text></TouchableOpacity>
                {/* <Pressable style={styles.submitButtonFormStyle} onPress={register_user}><Text style={styles.textStyleButton}>Register</Text></Pressable> */}


            </View >
        );
    } else {
        return (
            altScreen()
        )
    }
};


const styles = StyleSheet.create({
    sghcontainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        // backgroundColor: "lightblue",

    },
    overallContainer: {
        flex: 1,
        // backgroundColor: "yellow",
        alignItems: "center",
        justifyContent: "center",
        // display: "flex",
    },
    textStyleButton: {
        color: "#fff",
        textAlign: "center",
        fontSize: 40,
    },
    submitButtonFormStyle: {
        margin: 40,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        backgroundColor: "#2b2e6d",
        borderRadius: 30,
        // borderColor: "#fff",
        width: windowWidth * 0.8,
        height: windowHeight * 0.1,
    },
    dateBox: {
        // padding: 10,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        borderColor: "gray",
        borderRadius: 10,
        borderWidth: 1,
        width: windowWidth * 0.8,
        height: windowHeight * 0.06,
    },
    container: {
        alignItems: "center",
    },
    rowArrangement: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    formHeader: {
        fontSize: 30,
        // padding: 10,
        marginTop: 25,
        marginBottom: 10,


    },
    formBox: {
        padding: 10,
        borderColor: "gray",
        borderRadius: 10,
        borderWidth: 1,
        width: windowWidth * 0.8,
        height: windowHeight * 0.06,
    },
    formBoxDate: {
        padding: 10,
        borderColor: "gray",
        borderRadius: 10,
        borderWidth: 0.2,
        width: windowWidth * 0.8,
        height: 150,
    },
    submitButton: {
        fontSize: 30,
        padding: 10,
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 1
    },
    radioText: {
        fontSize: 20,
    }

})

export default RegisterUser;
