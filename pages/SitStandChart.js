import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    processColor
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Dimensions } from 'react-native';

import React, { useState, useEffect } from 'react';
import { VictoryBar, VictoryAxis, VictoryLine, VictoryBrushContainer, VictoryZoomContainer, VictoryChart, VictoryTheme } from "victory-native";
var db = openDatabase({ name: 'userDb.db' });

const SitStandChart = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    // const [selectedDomain, setSelectedDomain] = useState({})
    // const [zoomDomain, setZoomDomain] = useState({})
    // const [sitStand, setSitStand] = useState([])
    const [sitStandx, setSitStandx] = useState([])


    function handleZoon(domain) {
        setSelectedDomain(domain)
    }

    function handleBrush(domain) {
        setZoomDomain(domain)
    }

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_sitStand', [], (tx, results) => {
                for (let i = 0; i < results.rows.length; ++i) {
                }
            });
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_sitStand', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {

                    var unformattedDate = results.rows.item(i).date
                    var correctDateFormat = unformattedDate.replaceAll("-", "/")

                    console.log(new Date(correctDateFormat))
                    temp.push({
                        x: new Date(correctDateFormat),
                        y: results.rows.item(i).time
                    });
                }
                setSitStandx(temp);
            });
        });
    }, []);




    return (
        <View>
            <View>
            </View>
            <VictoryChart
                width={windowWidth * 0.9}
                height={windowHeight * 0.9}
                scale={{ x: "time" }}
                containerComponent={
                    <VictoryZoomContainer
                        responsive={false}
                        zoomDimension="x"
                        zoomDomain={handleZoon}
                        onZoomDomainChange={(x) => handleZoon(x)}

                    />
                }
            >

                <VictoryLine

                    style={{
                        data: { stroke: "tomato" }
                    }}
                    data={sitStandx}
                />
            </VictoryChart>
        </View >
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff"
    }
});



export default SitStandChart
