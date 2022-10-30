import {StyleSheet, Text, View, ScrollView, Pressable} from 'react-native';
import {Card, Searchbar, Title, Paragraph} from 'react-native-paper';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MQTT from 'sp-react-native-mqtt';

const HistoryScreen = ({navigation, route}) => {
  const [items, setItems] = useState([]);
  const [item1, setItem1] = useState([]);

  const {getId} = route.params;
  const onPressDetail = (id, place, parkid) => {
    const publishUser = status => {
      MQTT.createClient({
        uri: 'mqtt://broker.mqttdashboard.com:1883',
      })
        .then(function (client) {
          client.on('closed', function () {
            console.log('mqtt.event.closed');
          });
          client.on('connect', function () {
            console.log('connected');
            // client.publish('barrier/status',`${status}`,0,false);
            client.publish('user/booking', `${status}`, 0, false);
          });
          client.connect();
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    publishUser('http://10.0.2.2:6969/api/booking/' + getId);
    navigation.navigate('HistoryDetail', {
      id: id,
      place: place,
      parkid: parkid,
    });
  };

  const getBookingById = async () => {
    await fetch('http://10.0.2.2:6969/api/booking/' + getId)
      .then(res => res.json())
      .then(result => {
        setItems(result.data);
      });
  };

  const fetchDataParking = async () => {
    fetch('http://10.0.2.2:6969/api/carparking/' + route.params.place)
      .then(res => res.json())
      .then(result => {
        console.log('result', result.data[0]);
        setItem1(result.data[0]);
      });
  };

  useEffect(() => {
    getBookingById();
    fetchDataParking();
  }, []);
  return (
    <ScrollView>
      <View style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.headingText}>History</Text>
          <View style={styles.content}>
            {items.map(item => (
              <Pressable
                onPress={() =>
                  onPressDetail(
                    item.booking_id,
                    item.booking_place,
                    item.parking_id,
                  )
                }
                key={item.booking_id}>
                <View style={styles.showCard}>
                  <Card>
                    <Card.Content>
                      <Title>{item.booking_place}</Title>
                      <Paragraph>
                        <Text>Time Booking:{item.booking_time}</Text>
                        <Text> Time Out:{item.booking_timeout}</Text>
                        {'\n'}
                        <Text>Status:{item.booking_status}</Text>
                      </Paragraph>
                    </Card.Content>
                  </Card>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#3ec97c',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: 15,
  },
  headingText: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 15,
    marginTop: 20,
    color: '#fff',
    alignSelf: 'center',
  },
  headingTopic: {
    fontSize: 25,
    fontWeight: '700',
    color: '#2f2f2f',
    marginBottom: 10,
    marginTop: 10,
  },
  headingCard: {},
  content: {
    padding: 15,
    borderRadius: 10,
    // backgroundColor: '#fff',
  },
  showCard: {
    marginTop: 20,
    marginBottom: 20,
  },
});
