import React, { useContext, useEffect, useState, Fragment } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import {
  Card,
  DataTable,
  Paragraph,
  TouchableRipple,
} from "react-native-paper";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";

import { AuthContext } from "../../../context/AuthContext";
import { URL } from "../../../config";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthData = (props) => {
  const date = new Date(props.date).toISOString().substr(0, 10);
  return (
    <TouchableOpacity>
      <DataTable.Row
        style={{
          backgroundColor: props.status === "P" ? "#b3ffc6" : "#ffb3b3",
        }}
      >
        <DataTable.Cell>{date}</DataTable.Cell>
        <DataTable.Cell>{props.status}</DataTable.Cell>
      </DataTable.Row>
    </TouchableOpacity>
  );
};

const StudentAttendance = ({ navigation }) => {
  const initialMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(initialMonth);
  const [monthData, setMonthData] = useState([]);
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const [attState, setAttState] = useState({
    tDays: 0,
    pDays: 0,
    percentage: 0,
  });

  const getMonthAtt = async () => {
    console.log(
      URL + "/attendance/student/" + user._id + "/" + month.toString()
    );
    const res = await axios.get(
      URL + "/attendance/student/" + user._id + "/" + month.toString(),
      {
        headers: {
          "auth-token": authState.token,
        },
      }
    );
    let data = res.data.data;
    data.sort((a, b) => {
      const date1 = a.date.slice(8, 10);
      const date2 = b.date.slice(8, 10);
      return date1 - date2;
    });
    console.log(data);
    setMonthData(data);
    const p = data.filter((d) => d.status === "P");
    setAttState({
      tDays: data.length,
      pDays: p.length,
      percentage: ((p.length / data.length) * 100).toFixed(2),
    });
  };

  useEffect(() => {
    console.log(month);
    getMonthAtt();
  }, [month]);

  return (
    <Fragment>
      <DropDownPicker
        items={monthNames.map((m, i) => ({ label: m, value: i + 1 }))}
        defaultValue={month}
        containerStyle={{ height: 60, margin: 10 }}
        style={{ backgroundColor: "#fafafa" }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        onChangeItem={(item) => setMonth(item.value)}
      />
      <ScrollView>
        <View style={{ zIndex: 1 }}>
          <Card style={styles.card}>
            <Card.Title title="Attendance" subtitle={monthNames[month - 1]} />
            <Card.Content style={{ marginBottom: 12 }}>
              <Paragraph>Present Days: {attState.pDays}</Paragraph>
              <Paragraph>Total Days: {attState.tDays}</Paragraph>
              <Paragraph>Percent: {attState.percentage + "%"}</Paragraph>
            </Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Attendance</DataTable.Title>
              </DataTable.Header>
              {monthData.map((d) => (
                <MonthData date={d.date} status={d.status} key={d._id} />
              ))}
            </DataTable>
          </Card>
          <Text></Text>
        </View>
      </ScrollView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  card: { margin: 10, marginBottom: 0, marginTop: 15, paddingTop: 5 },
});

export default StudentAttendance;
