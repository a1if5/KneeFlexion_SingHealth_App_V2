import React, { useState, useEffect } from 'react';
import { openDatabase } from 'react-native-sqlite-storage';
import { WebView } from "react-native-webview";
var db = openDatabase({ name: 'userDb.db' });

const GoniometerFormSG = ({ navigation, route }) => {

    const [nric, setNric] = useState("")
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
                setNric(results.rows.item(0).nric)
            });
        });
    }, []);
    const { flexionData } = route.params;
    const { extensionData } = route.params;
    const x = route.params.paramKey;
    // const nricSubmitData = String(nricUser[0]);
    const flexion = parseInt(flexionData);
    const extension = parseInt(extensionData);
    console.log(flexion)
    console.log(extension)
    const runFirst = `setTimeout(function() {
    document.getElementById("60c86bcbc9c2cb001189ddc7").readOnly = true;
    document.getElementById("603c3d41526b9e00127a488f").readOnly = true;
    document.getElementById("603c3d5a7d837800126d12f7").readOnly = true;
    document.getElementById("60c86bcbc9c2cb001189ddc7").className = "";
    document.getElementById("603c3d41526b9e00127a488f").className = "";
    document.getElementById("603c3d5a7d837800126d12f7").className = "";
    document.getElementById('60c86bcbc9c2cb001189ddc7').value = '${nric}';
    document.getElementById('60c86bcbc9c2cb001189ddc7').dispatchEvent(new Event("input"));
    document.getElementById('603c3d41526b9e00127a488f').value = '${flexion}';
    document.getElementById('603c3d41526b9e00127a488f').dispatchEvent(new Event("input"));
    document.getElementById('603c3d5a7d837800126d12f7').value = '${extension}';
    document.getElementById('603c3d5a7d837800126d12f7').dispatchEvent(new Event("input"));
  }, 1000)`;
    return (
        <WebView
            javaScriptEnabled={true}
            source={{ uri: "https://form.gov.sg/#!/603c3ca2b3f2b10012a03bc4" }}
            onMessage={(event) => { }}
            injectedJavaScript={runFirst}
            style={{ flex: 1 }}
            javaScriptEnabled
        />
    );
};

export default GoniometerFormSG