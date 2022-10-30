import {StyleSheet, View} from 'react-native';
import {
  Avatar,
  Card,
  IconButton,
  BottomNavigation,
  TextInput,
  Button,
  Text,
} from 'react-native-paper';
import React, {useState, useEffect} from 'react';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingScreen = ({navigation, route}) => {
  const [open, setOpen] = useState(false);
  // Type Data Car
  const typeData = [
    {label: 'Toyota', value: 'Toyota'},
    {label: 'Honda', value: 'Honda'},
    {label: 'Isuzu', value: 'Isuzu'},
    {label: 'Mitsubishi', value: 'Mitsubishi'},
    {label: 'Ford', value: 'Ford'},
    {label: 'Nissan', value: 'Nissan'},
    {label: 'MG', value: 'MG'},
    {label: 'Mazda', value: 'Mazda'},
    {label: 'Suzuki', value: 'Suzuki'},
    {label: 'Mercedes-Benz', value: 'Mercedes-Benz'},
    {label: 'BMW', value: 'BMW'},
  ];

  // Get Carparking
  const [item, setItem] = useState([]);
  const {place} = route.params;
  const {parkid} = route.params;
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [plate, setPlate] = useState('');
  const [type, setType] = useState(null);
  const [timeBooking, setTimeBooking] = useState(new Date());
  const [user, setUser] = useState('');

  const handleBooking = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const responses = await fetch(
      'http://10.0.2.2:6969/api/bookingcarparking',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parking_id: parkid,
          booking_place: place,
          booking_name: name,
          booking_tel: tel,
          booking_plate: plate,
          booking_type: type,
          booking_date: moment().format('YYYY-MM-DD'),
          booking_time: timeBooking,
          user: userId,
        }),
      },
    )
      .then(response => response.json())
      .then(response => {
        if (response.status == 'ok') {
          alert('Booking Successfully');
          navigation.navigate('Home');
        } else {
          alert('Booking Failed');
          navigation.navigate('Home');
        }
      });
  };

  return (
    <View style={styles.backGround}>
      <View style={styles.container}>
        <Text style={styles.headingText}>Booking</Text>
        <Text style={styles.headingText}>Place:{route.params.place}</Text>
        <TextInput
          style={styles.inputText}
          label="Name"
          value={name}
          mode="flat"
          onChangeText={text => setName(text)}
        />
        <TextInput
          style={styles.inputText}
          label="Tel"
          value={tel}
          mode="flat"
          onChangeText={text => setTel(text)}
        />
        <TextInput
          style={styles.inputText}
          label="Plate"
          value={plate}
          mode="flat"
          onChangeText={text => setPlate(text)}
        />
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={typeData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Type Car"
          searchPlaceholder="Search..."
          value={type}
          onChange={item => {
            setType(item.value);
          }}
        />
        <Button onPress={() => setOpen(true)}>Select Time Booking</Button>
        <DatePicker
          modal
          open={open}
          date={timeBooking}
          mode="time"
          onConfirm={date => {
            setOpen(false);
            setTimeBooking(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Text style={styles.textwarning}>
          ** Booking can be appointment for up to 1 hour. **
        </Text>
        <Button
          style={styles.btnBooking}
          mode="contained"
          // onPress={handleBooking}
          onPress={handleBooking}>
          Booking
        </Button>
      </View>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: '#3ec97c',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headingText: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 15,
  },
  bottomText: {
    fontSize: 16,
    fontWeight: '400',
    alignSelf: 'center',
    marginTop: 16,
  },
  bottomSpan: {
    fontWeight: '700',
    color: '#80247e',
  },
  inputText: {
    marginBottom: 20,
  },
  btnBooking: {
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 20,
    backgroundColor: '#2f2f2f',
  },
  namePlace: {marginBottom: 10},
  textwarning: {
    alignSelf: 'center',
    color: '#dc3545',
    fontWeight: '700',
    marginBottom: 10,
  },
  dropdown: {
    height: 62,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: '#ececec',
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    marginLeft: 10,
    fontSize: 16,
  },
  selectedTextStyle: {
    marginLeft: 10,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
