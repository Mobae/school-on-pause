import * as React from 'react';
import { Text, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Searchbar,
  TouchableRipple,
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

import { AdminContext } from '../../context/AdminContext';
const LeftContent = (props) => (
  <Avatar.Icon
    {...props}
    icon='google-classroom'
    style={{ backgroundColor: '#2E6E80' }}
  />
);
import adminStyles from './AdminStyles';

const ClassList = ({ navigation }) => {
  const {
    adminState,
    setCurrClass,
    currClass,
    setFlag,
    reload,
    getClasses,
  } = React.useContext(AdminContext);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filtered, setFiltered] = React.useState(adminState.classes);
  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  React.useEffect(() => {
    if (searchQuery === '') {
      setFiltered(adminState.classes);
    } else {
      setFiltered(
        adminState.classes.filter((class_) => {
          if (class_.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return class_;
          }
        })
      );
    }
  }, [searchQuery]);

  React.useEffect(() => {
    getClasses();
  }, [reload]);

  return (
    <React.Fragment>
      <Searchbar
        placeholder='Search class..'
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <View style={adminStyles.scroll}>
        <ScrollView>
          {filtered ? (
            filtered.map((class_) => (
              <View key={class_._id}>
                <Card style={adminStyles.card}>
                  <TouchableRipple
                    onPress={() => {
                      setCurrClass(class_._id);
                      setFlag(false);
                      navigation.navigate('ClassView');
                    }}
                  >
                    <React.Fragment>
                      <Card.Title title={class_.name} left={LeftContent} />
                      <Card.Content></Card.Content>
                    </React.Fragment>
                  </TouchableRipple>
                </Card>
              </View>
            ))
          ) : (
            <Card style={adminStyles.card}>
              <Card.Title title='None' left={LeftContent} />
            </Card>
          )}
          <Text></Text>
          <Text></Text>
          <Text></Text>
        </ScrollView>
      </View>
    </React.Fragment>
  );
};

export default ClassList;
