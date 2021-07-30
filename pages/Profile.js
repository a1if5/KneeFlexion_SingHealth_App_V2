
import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
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
    let [flatListItems, setFlatListItems] = useState([]);
    const [dateList, setDateList] = useState([])
    const [flexionList, setFlexionList] = useState([])
    const [extensionList, setExtensionList] = useState([])
    const [sitStandList, setSitStandList] = useState([])


    const [measurementDateList, setMeasurementDateList] = useState([])
    const [dateVal, setDateVal] = useState("")
    const [flexionVal, setFlexionVal] = useState("")
    const [extensionVal, setExtensionVal] = useState("")
    const [sitStandVal, setSitStandVal] = useState("")

    const [latestFlexionVal, setLatestFlexionVal] = useState("")
    const [latestExtensionVal, setLatestExtensionVal] = useState("")
    const [latestSitStandVal, setLatestSitStandVal] = useState("")


    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                    temp.push(results.rows.item(i));
                setFlatListItems(temp);
            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_allDate', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                    temp.push(results.rows.item(i));
                setDateList(temp);
            });
            // console.log(dateList)
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_sitStand', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    if (i == results.rows.length - 1) {
                        setLatestSitStandVal(results.rows.item(i).time)
                    } else {
                        setLatestSitStandVal("")
                    }
                }
                setSitStandList(temp);

            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_flexion', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    if (i == results.rows.length - 1) {
                        setLatestFlexionVal(results.rows.item(i).degree)
                    } else {
                        setLatestFlexionVal("")
                    }
                }
                setFlexionList(temp);
            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_extension', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    if (i == results.rows.length - 1) {
                        setLatestExtensionVal(results.rows.item(i).degree)
                    } else {
                        setLatestExtensionVal("")
                    }
                }
                setExtensionList(temp);
            });
        });
    }, []);

    let listViewItemSeparator = () => {
        return (
            <View
                style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }}
            />
        );
    };

    let listItemView = (item) => {
        var date = new Date(item.surgeryDate)
        // var formatDate = item.surgeryDate
        return (
            <View
                key={item.user_id}
                style={styles.userInfoContainer}>
                <Text style={styles.userInfoText}>Name: {item.name}</Text>
                <Text style={styles.userInfoText}>Gender: {item.gender.toString().charAt(0).toUpperCase()}{item.gender.toString().slice(1)}</Text>
                <Text style={styles.userInfoText}>NRIC: {item.nric}</Text>
                <Text style={styles.userInfoText}>Surgery Date: {date.getDate()} / {date.getMonth()} / {date.getFullYear()}</Text>
            </View>
        );
    };
    const renderItem = () => {
        return (
            <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
                <Card>
                    <Card.Content>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text>
                                Date:
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };
    function RenderReadings(day) {
        console.log(day)

        setDateVal(day)
        sitStandList.map((x) => {
            if (x.date == day) {
                setSitStandVal(x.time)
            } else {
                setSitStandVal("")
            }
        })
        flexionList.map((x) => {
            if (x.date == day) {
                console.log(x.date)
                setFlexionVal(x.degree)
            } else {
                setFlexionVal("")
            }
        })
        extensionList.map((x) => {
            if (x.date == day) {
                console.log(x.date)
                setExtensionVal(x.degree)
            } else {
                setExtensionVal("")
            }
        })
    };

    const flexion = { key: 'flexion', color: 'red' };
    const extension = { key: 'extension', color: 'blue' };
    const sitstand = { key: 'sitstand', color: 'green' };
    var dotsList = []

    //Function to label dates in calendar
    let markedDay = {}
    dateList.map((x) => {
        var overallBoolean = false
        var flexionBoolean = false
        var extensionBoolean = false
        var sitStandBoolean = false
        var splitDateArr = []
        splitDateArr = x.date.split("/")
        if (splitDateArr[1].length == 1) {
            splitDateArr[1] = "0" + splitDateArr[1]
        }
        if (splitDateArr[2].length == 1) {
            splitDateArr[2] = "0" + splitDateArr[2]
        }
        var adaptedDate = splitDateArr[0] + "-" + splitDateArr[1] + "-" + splitDateArr[2]
        sitStandList.map((x) => {
            if (x.date == adaptedDate && x.time.toString().length > 0) {
                sitStandBoolean = true
                dotsList.push(sitstand)
            }
            // } else {
            //     dotsList.pop(sitstand)
            // }
        })
        flexionList.map((x) => {
            if (x.date == adaptedDate && x.degree.toString().length > 0) {
                flexionBoolean = true
                dotsList.push(flexion)
            }
            // } else {
            //     dotsList.pop(flexion)
            // }
        })
        extensionList.map((x) => {
            if (x.date == adaptedDate && x.degree.toString().length > 0) {
                extensionBoolean = true
                dotsList.push(extension)
            }
            // } else {
            //     dotsList.pop(extension)
            // }
        })
        if (sitStandBoolean == true && extensionBoolean == true && flexionBoolean == true) {
            overallBoolean = true
        }
        markedDay[adaptedDate] = {
            // marked: overallBoolean,
            dots: dotsList,
        }
        dotsList = []
    })
    return (
        <ScrollView>
            <View style={styles.container}>

                <FlatList
                    data={flatListItems}
                    ItemSeparatorComponent={listViewItemSeparator}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => listItemView(item)}
                />



                <View style={styles.rowArrangement}>
                    <View style={styles.innerRowArrangementLeft}>
                        <Text style={styles.readingsText}>Latest Knee Flexion:</Text>
                    </View>
                    <View style={styles.innerRowArrangementMiddle}>
                        {latestFlexionVal !== "" ?
                            <Text style={styles.readingsTextCenter}>{latestFlexionVal} °</Text>
                            :
                            <Text style={styles.readingsTextCenter}>Please start recording</Text>
                        }
                    </View>
                    <View style={styles.innerRowArrangementRight}>
                        <TouchableOpacity style={styles.submitButton} onPress={() => { navigation.navigate("FlexionChart") }}><Text style={styles.submitButtonText}>View Chart</Text></TouchableOpacity>
                    </View>
                </View>


                <View style={styles.rowArrangement}>
                    <View style={styles.innerRowArrangementLeft}>
                        <Text style={styles.readingsText}>Latest Knee Extension:</Text>
                    </View>
                    <View style={styles.innerRowArrangementMiddle}>
                        {latestExtensionVal !== "" ?
                            <Text style={styles.readingsTextCenter}>{latestExtensionVal} °</Text>
                            :
                            <Text style={styles.readingsTextCenter}>Please start recording</Text>
                        }
                    </View>
                    <View style={styles.innerRowArrangementRight}>
                        <TouchableOpacity style={styles.submitButton}><Text style={styles.submitButtonText}>View Chart</Text></TouchableOpacity>
                    </View>
                </View>


                <View style={styles.rowArrangement}>
                    <View style={styles.innerRowArrangementLeft}>
                        <Text style={styles.readingsText}>Latest Sit Stand Timing:</Text>
                    </View>
                    <View style={styles.innerRowArrangementMiddle}>
                        {latestSitStandVal !== "" ?
                            <Text style={styles.readingsTextCenter}>{latestSitStandVal} seconds</Text>
                            :
                            <Text style={styles.readingsTextCenter}>Please start recording</Text>
                        }
                    </View>
                    <View style={styles.innerRowArrangementRight}>
                        <TouchableOpacity style={styles.submitButton}><Text style={styles.submitButtonText}>View Chart</Text></TouchableOpacity>
                    </View>
                </View>
            </View >






            <View style={styles.paddingContainer}>
                <Calendar
                    onDayPress={(day) => { RenderReadings(day.dateString) }}
                    markingType={'multi-dot'}
                    markedDates={markedDay}
                ></Calendar>







                <View style={styles.upperPadding}>
                    <View style={styles.readingsTextInnerContainer}>
                        <View style={styles.readingsTextLeft}>
                            <Text style={styles.readingsText}>Date:</Text>
                        </View>
                        <View style={styles.readingsTextRight}>
                            {dateVal !== "" ?
                                <Text style={styles.readingsTextCenter}>{dateVal}</Text>
                                :
                                <Text style={styles.readingsTextCenter}>Please select a date</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.readingsTextInnerContainer}>
                        <View style={styles.readingsTextLeft}>
                            <Text style={styles.readingsText}>Flexion:</Text>
                        </View>
                        <View style={styles.readingsTextRight}>
                            {flexionVal == "" ?
                                <Text style={styles.readingsTextCenter}>Not Recorded</Text>
                                :
                                <Text style={styles.readingsTextCenter}>{flexionVal} °</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.readingsTextInnerContainer}>
                        <View style={styles.readingsTextLeft}>
                            <Text style={styles.readingsText}>Extension:</Text>
                        </View>
                        <View style={styles.readingsTextRight}>
                            {extensionVal == "" ?
                                <Text style={styles.readingsTextCenter}>Not Recorded</Text>
                                :
                                <Text style={styles.readingsTextCenter}>{extensionVal} °</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.readingsTextInnerContainer}>
                        <View style={styles.readingsTextLeft}>
                            <Text style={styles.readingsText}>Sit Stand:</Text>
                        </View>
                        <View style={styles.readingsTextRight}>
                            {sitStandVal == "" ?
                                <Text style={styles.readingsTextCenter}>Not Recorded</Text>
                                :
                                <Text style={styles.readingsTextCenter}>{sitStandVal} seconds</Text>
                            }
                        </View>
                    </View>
                </View>


            </View>
        </ScrollView >







    )

}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // backgroundColor: "white",
    },
    userInfoContainer: {
        // backgroundColor: "yellow",
        width: windowWidth,
        paddingLeft: 10,
        paddingBottom: 5,
        paddingTop: 5,
        margin: 3,
        borderBottomWidth: 0.5,
        borderColor: "lightblue",
    },
    userInfoText: {
        marginBottom: 2,
        fontSize: 20,
    },

    rowArrangement: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        paddingLeft: 10,
        paddingBottom: 5,
        paddingTop: 5,
        margin: 3,
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderColor: "lightblue",
        // justifyContent: "space-between",
    },
    innerRowArrangementLeft: {
        flex: 0.35,
    },
    innerRowArrangementMiddle: {
        flex: 0.35,
    },
    innerRowArrangementRight: {
        flex: 0.3,
    },

    formHeader: {
        fontSize: 30,
        padding: 10,

    },
    formBox: {
        padding: 10,
        borderColor: "gray",
        borderRadius: 10,
        borderWidth: 1,
        width: 300,
    },
    formBoxDate: {
        padding: 10,
        borderColor: "gray",
        borderRadius: 10,
        borderWidth: 1,
        width: 300,
        height: 150,
    },
    submitButton: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        padding: 10,
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 0.1,
        margin: 10,
        backgroundColor: "lightblue",

    },
    submitButtonText: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
    },
    readingsText: {
        fontSize: 20,
    },
    readingsTextCenter: {
        fontSize: 20,
        textAlign: "center",
    },

    paddingContainer: {
        padding: 10,
    },
    upperPadding: {
        paddingTop: 10,
    },
    readingsTextInnerContainer: {
        display: 'flex',
        flexDirection: "row",
        paddingBottom: 4,
    },
    readingsTextLeft: {
        flex: 0.3,
    },
    readingsTextRight: {
        flex: 0.7,
    }


})


export default Profile

