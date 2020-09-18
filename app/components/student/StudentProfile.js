import React, { Fragment, useContext, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import {
  Avatar,
  Paragraph,
  Card,
  TouchableRipple,
  Button,
} from "react-native-paper";

import { AuthContext } from "../../context/AuthContext";

const ProfileIcon = (props) => (
  <Avatar.Icon {...props} icon="account" size={45} style = {{backgroundColor: '#4a3b82'}} />
);

const AttendanceIcon = (props) => (
  <Avatar.Icon {...props} icon="book" size={45} style = {{backgroundColor: '#4a3b82'}} />
);

const StudentProfile = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  useEffect(() => {}, [authState]);

  return (
    <Fragment>
      <Card style={styles.card}>
        <TouchableRipple onPress={() => navigation.push("Profile")}>
          <Fragment>
            <Card.Title
              title="Profile"
              subtitle={user.name}
              left={ProfileIcon}
            />
            <Card.Content style={{ marginBottom: 8 }}>
              <Paragraph>Email: {user.email}</Paragraph>
              <Paragraph>Class: {user.className}</Paragraph>
            </Card.Content>
          </Fragment>
        </TouchableRipple>
      </Card>
      <Card style={styles.card}>
        <TouchableRipple onPress={() => navigation.push("Attendance")}>
          <Card.Title
            title="Attendance"
            subtitle="View Attendance"
            left={AttendanceIcon}
          />
        </TouchableRipple>
      </Card>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  card: { margin: 10, marginBottom: 0 },
});

export default StudentProfile;
