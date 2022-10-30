import {StyleSheet, View, ScrollView, Linking} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Avatar,
  Card,
  IconButton,
  BottomNavigation,
  TextInput,
  Button,
  Text,
} from 'react-native-paper';
const CreateParkingScreen = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [quantity, setQuantity] = useState('');
  const [count, setCount] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [detail, setDetail] = useState('');
  const [locationurl, setLocationUrl] = useState('');
  const [bot, setBot] = useState('');

  const handleCreate = async () => {
    const responses = await fetch('http://10.0.2.2:6969/api/createcarparking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        name_th: nameTh,
        quantity: 0,
        count: count,
        price: price,
        status: 'เปิด',
        img: img,
        detail: detail,
        locationurl: locationurl,
        bot: bot,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.status == 'ok') {
          alert('Create  Successfully');
          navigation.navigate('Home');
        } else {
          alert('Create Failed');
          navigation.navigate('Home');
        }
      });
  };

  return (
    <ScrollView>
      <View style={styles.backGround}>
        <Text style={styles.headingText}>CreateParking</Text>
        <View style={styles.container}>
          <TextInput
            style={styles.inputText}
            label="Name"
            value={name}
            mode="flat"
            onChangeText={text => setName(text)}
          />
          <TextInput
            style={styles.inputText}
            label="Name Th"
            value={nameTh}
            mode="flat"
            onChangeText={text => setNameTh(text)}
          />
          <TextInput
            style={styles.inputText}
            label="Count"
            value={count}
            mode="flat"
            onChangeText={text => setCount(text)}
          />
          <TextInput
            style={styles.inputText}
            label="Price"
            value={price}
            mode="flat"
            onChangeText={text => setPrice(text)}
          />
          <TextInput
            style={styles.inputText}
            label="Detail"
            value={detail}
            mode="flat"
            onChangeText={text => setDetail(text)}
          />
          <Text
            onPress={() => Linking.openURL('https://www.picz.in.th/?lang=th')}>
            <Text style={styles.dokjan}>*</Text>Link to upload img
          </Text>

          <TextInput
            style={styles.inputText}
            label="Img"
            value={img}
            mode="flat"
            onChangeText={text => setImg(text)}
          />

          <Text
            onPress={() => Linking.openURL('https://www.google.co.th/maps/')}>
            <Text style={styles.dokjan}>*</Text>Link to upload url location
          </Text>

          <TextInput
            style={styles.inputText}
            label="LocationUrl"
            value={locationurl}
            mode="flat"
            onChangeText={text => setLocationUrl(text)}
          />
          <Text
            onPress={() =>
              Linking.openURL(' https://notify-bot.line.me/oauth/authorize')
            }>
            <Text style={styles.dokjan}>*</Text>Link to upload token bot
          </Text>

          <TextInput
            style={styles.inputText}
            label="Token Bot"
            value={bot}
            mode="flat"
            onChangeText={text => setBot(text)}
          />

          <Button
            style={styles.btnBooking}
            mode="contained"
            onPress={handleCreate}>
            Create
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateParkingScreen;

const styles = StyleSheet.create({
  backGround: {
    backgroundColor: '#3ec97c',
    width: '100%',
    height: '100%',
  },
  container: {
    padding: 30,
  },
  headingText: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: '700',
    alignSelf: 'center',
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
  dokjan: {
    color: 'red',
  },
});
