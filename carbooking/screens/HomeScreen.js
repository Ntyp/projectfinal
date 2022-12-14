import {StyleSheet, Text, View, Image} from 'react-native';
import {Button, FAB, Portal, Provider} from 'react-native-paper';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const HomeScreen = ({navigation}) => {
  const [item1, setItem1] = useState({});
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const accessToken = await AsyncStorage.getItem('@accessToken');
    const response = await fetch('http://10.0.2.2:6969/api/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    });
    const data = await response.json();
    const userId = data.user[0].userid;
    setItem1(data.user[0]);
    console.log(data.user[0]);
    setUser(userId);
    setIsLoading(false);
    AsyncStorage.setItem('userid', JSON.stringify(data.user[0].userid));
    EncryptedStorage.setItem('userid', JSON.stringify(data.user[0].userid));
  };

  const handleLogout = async () => {
    const accessToken = await AsyncStorage.getItem('@accessToken');
    AsyncStorage.removeItem('userid');
    setUser({});
    const responses = await fetch('http://10.0.2.2:6969/api/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    });
    console.log('useridEiei:', AsyncStorage.getItem('@userid'));
    navigation.navigate('Login');
  };

  useEffect(() => {
    fetchUser();
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.headingImg}
        source={require('../components/img/homescreen.png')}
      />
      <Text style={styles.headingText}>Find a place to park</Text>
      <Text style={styles.subText}>
        This program created for KMUTNB student.
      </Text>

      {item1.status === 'user' ? (
        <Button
          style={styles.btnStarted}
          mode="contained"
          onPress={() => navigation.navigate('Carparking')}>
          Get Started
        </Button>
      ) : null}

      {item1.status === 'user' ? (
        <Button
          style={styles.btnHistory}
          mode="contained"
          onPress={() => navigation.navigate('History', {getId: user})}>
          History Booking
        </Button>
      ) : null}

      {item1.status === 'admin' ? (
        <Button
          style={styles.btnHistory}
          mode="contained"
          onPress={() => navigation.navigate('CreateCarparking')}>
          Create Carparking
        </Button>
      ) : null}
      <Text style={styles.logoutText} onPress={handleLogout}>
        Logout
      </Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#3ec97c',
  },
  headingImg: {
    width: '100%',
    height: 333,
    marginBottom: 30,
  },
  headingText: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 15,
    color: '#2f2f2f',
    textAlign: 'center',
  },
  subText: {
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 20,
  },
  btnStarted: {
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 5,
    backgroundColor: '#2f2f2f',
    justifyContent: 'flex-end',
  },
  btnHistory: {
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 5,
    backgroundColor: '#2f2f2f',
    marginTop: 15,
  },
  logoutText: {
    alignSelf: 'center',
    marginTop: 10,
    color: '#dc3545',
    fontWeight: '700',
  },
});
