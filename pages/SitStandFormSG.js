import React, { useState, useEffect } from 'react';
import { openDatabase } from 'react-native-sqlite-storage';
import { WebView } from "react-native-webview";
var db = openDatabase({ name: 'userDb.db' });

const SitStandFormSG = ({ navigation, route }) => {

    const [nric, setNric] = useState("")
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
                setNric(results.rows.item(0).nric)
            });
        });
    }, []);

    const { timeData } = route.params;
    const x = route.params.paramKey;
    const timeValue = timeData;
    const runFirst = `setTimeout(function() {
      document.getElementById("60c86b8dfacc0b001145812d").readOnly = true;
      document.getElementById("6098d0a38a5d310012f967d3").readOnly = true;
      document.getElementById("60c86b8dfacc0b001145812d").className = "";
      document.getElementById("6098d0a38a5d310012f967d3").className = "";
      document.getElementById('60c86b8dfacc0b001145812d').value = '${nric}';
      document.getElementById('60c86b8dfacc0b001145812d').dispatchEvent(new Event("input"));
      document.getElementById('6098d0a38a5d310012f967d3').value = '${timeValue}';
      document.getElementById('6098d0a38a5d310012f967d3').dispatchEvent(new Event("input"));
    }, 2000)`;
    return (
        <WebView
            javaScriptEnabled={true}
            source={{ uri: "https://form.gov.sg/#!/6092586dbee1190011689234" }}
            onMessage={(event) => { }}
            injectedJavaScript={runFirst}
            style={{ flex: 1 }}
            javaScriptEnabled
        />
    );
};

export default SitStandFormSG