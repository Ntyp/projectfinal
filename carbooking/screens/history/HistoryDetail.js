import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Button, BottomNavigation, Avatar} from 'react-native-paper';
import MQTT from 'sp-react-native-mqtt';

const HistoryDetail = ({navigation, route}) => {
  const image = {uri: 'https://picsum.photos/700'};
  const [item, setItem] = useState({});
  const [item1, setItem1] = useState({});
  const publishBarrier = status => {
    MQTT.createClient({
      uri: 'mqtt://broker.mqttdashboard.com:1883',
    })
      .then(function (client) {
        client.on('closed', function () {
          console.log('mqtt.event.closed');
        });
        client.on('connect', function () {
          console.log('connected');
          client.publish('barrier/status', `${status}`, 0, false);
          // client.publish('user/booking',`${status}`,0,false);
        });
        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const onPressDetail = (id, place) => {
    navigation.navigate('Booking', {id: id, place: place});
    navigation.navigate('Home');
  };

  const goIn = async () => {
    fetch('http://10.0.2.2:6969/api/history/goin/' + route.params.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({}),
    });
    publishBarrier('open');
    alert('ยินดีด้วยคุณมาถึงที่จอดรถเรียบร้อย');
    navigation.navigate('Home');
  };

  const goOut = async () => {
    fetch('http://10.0.2.2:6969/api/history/goout/' + route.params.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({}),
    });
    alert(
      'การจอดเสร็จสิ้นขอบคุณสำหรับการใช้บริการ กรุณาเตรียมเงินให้พร้อมและจ่ายเงินได้ที่พนักงานควบคุมลานจอด',
    );
    navigation.navigate('Home');
  };

  const fetchDataParking = async () => {
    fetch('http://10.0.2.2:6969/api/carparking/' + route.params.parkid)
      .then(res => res.json())
      .then(result => {
        console.log('result', result.data[0]);
        setItem(result.data[0]);
      });
  };

  const fetchDataBooking = async () => {
    await fetch('http://10.0.2.2:6969/api/history/' + route.params.id)
      .then(res => res.json())
      .then(result => {
        console.log('result1', result.data[0]);
        setItem1(result.data[0]);
      });
  };

  useEffect(() => {
    fetchDataParking();
    fetchDataBooking();
  }, []);
  return (
    <View style={styles.backGround}>
      <ImageBackground
        source={{uri: item.parking_img}}
        resizeMode="cover"
        style={styles.headingImg}>
        <View style={styles.emptyView}></View>
        <View style={styles.content}>
          <Text style={styles.namePlace}>{item.parking_name}</Text>
          <Text style={styles.locationPlace}>
            Bangkok,Thailand
            <Text
              style={styles.txtMap}
              onPress={() => Linking.openURL(item.parking_locationurl)}>
              Map Direction
            </Text>
          </Text>
          <Text style={styles.locationPlace}>
            Status:{item1.booking_status}
          </Text>
          <View style={styles.hrLine}></View>
          <Text style={styles.topicPlace}>Time Start</Text>
          <Text style={styles.detailPlace}>{item1.booking_time}</Text>
          <Text style={styles.topicPlace}>Time Out</Text>
          <Text style={styles.detailPlace}>{item1.booking_timeout}</Text>
          <Text style={styles.topicPlace}>Cost</Text>
          <Text style={styles.spanContent}>{item1.booking_price}฿</Text>

          {item1.booking_status == 'Waiting' ? (
            <Button style={styles.btnBook} mode="contained" onPress={goIn}>
              Let's park
            </Button>
          ) : null}

          {item1.booking_status == 'Arrive' ? (
            <Button style={styles.btnBook1} mode="contained" onPress={goOut}>
              Finish
            </Button>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
};

export default HistoryDetail;

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: '#3ec97c',
  },
  headingImg: {
    width: '100%',
    height: 310,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  emptyView: {
    height: 220,
  },
  content: {
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    // height: '80%',
  },
  hrLine: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  txtMap: {
    color: '#3ec97c',
  },
  namePlace: {
    color: '#000',
    fontSize: 30,
    fontWeight: '700',
    paddingTop: 60,
    marginBottom: 10,
  },
  topicPlace: {
    color: '#3ec97c',
    fontWeight: '700',
    fontSize: 22,
    textDecorationLine: 'underline',
    textDecorationColor: '#3ec97c',
    paddingBottom: 10,
  },
  detailPlace: {color: '#868686', paddingTop: 10, paddingBottom: 10},
  locationPlace: {color: '#868686', marginBottom: 25, fontWeight: '700'},
  textContent: {
    color: '#3ec97c',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    marginRight: 20,
  },
  textContent1: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    marginRight: 20,
  },
  spanContent: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
  },
  btnBook: {
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 100,
    backgroundColor: '#3ec97c',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  btnBook1: {
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 100,
    backgroundColor: '#dc3545',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});
