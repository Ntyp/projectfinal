var express = require('express');
var cors = require('cors');
var app = express();
const mysql = require('mysql2');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// const moment = require('momentjs');
// const { result } = require('lodash');
var moment = require('moment');
const { format } = require('date-fns');
// const { result } = require('lodash');
const secret = 'secToken';
const saltRounds = 10;
require('dotenv').config();

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(cors());

// Connect Database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'carparking',
});
console.log('Database  Connected!!');

// Auth
app.get('/api/users', function (req, res, next) {
  connection.query('SELECT * FROM `users', function (err, results, fields) {
    res.json(results);
  });
});

app.post('/api/register', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    connection.execute(
      'INSERT INTO users (username,password,status) VALUES (?,?,?)',
      [username, hash, 'user'],
      function (err, results, fields) {
        if (err) {
          res.json({ status: 'error', message: err });
          return;
        }
        res.json({ status: 'ok' });
      }
    );
  });
});

app.post('/api/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  connection.execute(
    'SELECT * FROM users WHERE username = ?',
    [username],
    function (err, users, fields) {
      if (err) {
        res.json({ status: 'error', message: err });
        return;
      }
      if (users.length == 0) {
        res.json({ status: 'error', message: 'User not found' });
        return;
      }
      bcrypt.compare(password, users[0].password, function (err, isLogin) {
        if (isLogin) {
          var token = jwt.sign({ username: users[0].username }, secret, {
            expiresIn: '1h',
          });
          res.json({ status: 'ok', message: 'Login Success!', token });
        } else {
          res.json({ status: 'error', message: 'Login Failed!' });
        }
      });
    }
  );
});

app.post('/api/authen', jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: 'ok', decoded });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

app.get('/api/auth/user', jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var decoded = jwt.verify(token, secret);
    connection.query(
      'SELECT * FROM users WHERE username = ?',
      [decoded.username],
      function (err, results, fields) {
        res.json({ status: 'ok', user: results });
      }
    );
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

// =============================
// @DESC::Carparking
// =============================
app.get('/api/carparking', function (req, res, next) {
  connection.query('SELECT * FROM parking', function (err, results, fields) {
    res.json({ status: 'ok', data: results });
  });
});
app.get('/api/carparking/:id', function (req, res, next) {
  connection.query(
    'SELECT * FROM parking WHERE parking_id = ?',
    [req.params['id']],
    function (err, results, fields) {
      res.json({ status: 'ok', data: results });
    }
  );
});

// =============================
// @DESC::History Booking
// =============================
app.get('/api/booking', function (req, res, next) {
  connection.query('SELECT * FROM booking', function (err, results, fields) {
    res.json(results);
  });
});

app.post('/api/bookingcarparking', function (req, res, next) {
  var placeId = req.body.parking_id;
  var place = req.body.booking_place;
  var name = req.body.booking_name;
  var tel = req.body.booking_tel;
  var plate = req.body.booking_plate;
  var type = req.body.booking_type;
  var time = req.body.booking_time;
  var date = req.body.booking_date;
  var user = req.body.user;

  // res.json(req.body);
  console.log(req.body);
  console.log(moment(time).format('HH:mm:ss'));
  console.log(moment().format('HH:mm:ss'));

  // Step1 Check bookingtime < 1HR ?
  var hourDiff = moment(time).diff(moment(), 'minute');
  console.log(hourDiff);
  if (hourDiff >= 60 && hourDiff <= 120) {
    connection.query(
      'SELECT * FROM parking WHERE parking_id = ?',
      [placeId],
      function (err, results, fields) {
        // Step2 Check full count ?
        console.log('eiei');
        res.json(results);
        var quantity = results[0].parking_quantity;
        var count = results[0].parking_count;
        // console.log(quantity);

        if (quantity < count) {
          //  Step3 Update Quatity +1
          var newQuatity = results[0].parking_quantity + 1;
          connection.execute(
            'UPDATE parking SET parking_quantity = ? WHERE parking_id = ?',
            [newQuatity, placeId],
            function (err, results, fields) {
              if (err) {
                res.json({ status: 'error', message: err });
                return;
              }
              // Step4 Find lane
              var lane = 1;
              for (var lane = 1; lane <= count; lane++) {
                connection.query(
                  'SELECT * FROM parking_detail WHERE parking_id = ? AND parking_lane = ?',
                  [placeId, lane],
                  function (err, results, fields) {
                    if (results[0].parking_plate == null || '') {
                      var chooseLane = results[0].parking_lane;
                      console.log('chooseLane', chooseLane);
                      return;
                    }
                  }
                );
                break;
              }
              // connection.query(
              //   'UPDATE parking_detail SET parking_plate = ? WHERE parking_id = ? AND parking_lane = ?',
              //   [plate, placeId, chooseLane],
              //   function (err, results, fields) {
              //     connection.query(
              //       'INSERT INTO booking (booking_place,booking_name,booking_tel,booking_plate,booking_type,booking_lane,booking_time,booking_date,booking_status,booking_user) VALUES (?,?,?,?,?,?,?,?,?,?)',
              //       [
              //         place,
              //         name,
              //         tel,
              //         plate,
              //         type,
              //         chooseLane,
              //         time,
              //         date,
              //         'Waiting',
              //         user,
              //       ],
              //       function (err, results, fields) {
              //         res.json({ status: 'ok' });
              //         return;
              //       }
              //     );
              //   }
              // );
            }
          );
        } else {
          res.json({ status: 'error', message: 'Carparking Full!!' });
        }
      }
    );
  } else {
    res.json({ status: 'error', message: 'Time booking < 1Hr Or > 2Hr' });
  }
});

// History Booking
app.get('/api/booking/:id', function (req, res, next) {
  connection.query(
    'SELECT * FROM booking WHERE booking_user = ? ORDER BY booking_id DESC',
    [req.params['id']],
    function (err, results, fields) {
      res.json({ status: 'ok', data: results });
    }
  );
});

app.get('/api/history/:id', function (req, res, next) {
  connection.query(
    'SELECT * FROM booking WHERE booking_id = ?',
    [req.params['id']],
    function (err, results, fields) {
      res.json({ status: 'ok', data: results });
    }
  );
});

// Update Status Goin
app.put('/api/history/goin/:id', function (req, res, next) {
  connection.query(
    'UPDATE booking SET booking_status = ? WHERE booking_id = ?',
    ['Arrive', req.params['id']],
    function (err, results, fields) {
      res.json({ status: 'ok' });
    }
  );
});

// Update Status Goout
app.put('/api/history/goout/:id', function (req, res, next) {
  connection.query(
    'SELECT * FROM booking WHERE booking_id = ?',
    [req.params['id']],
    function (err, results, fields) {
      var parking_id = results[0].parking_id;

      // const timeBooking = moment(results.booking_time); //"2022-10-29T17:21:20.020Z"
      function getTimeInSeconds(str) {
        let curr_time = [];

        curr_time = str.split(':');
        for (let i = 0; i < curr_time.length; i++) {
          curr_time[i] = parseInt(curr_time[i]);
        }

        let t = curr_time[0] * 60 * 60 + curr_time[1] * 60 + curr_time[2];

        return t;
      }

      // Function to convert seconds back to hh::mm:ss
      // format
      function convertSecToTime(t) {
        let hours = Math.floor(t / 3600);
        let hh = hours < 10 ? '0' + hours.toString() : hours.toString();
        let min = Math.floor((t % 3600) / 60);
        let mm = min < 10 ? '0' + min.toString() : min.toString();
        let sec = (t % 3600) % 60;
        let ss = sec < 10 ? '0' + sec.toString() : sec.toString();
        let ans = hh + ':' + mm + ':' + ss;
        return ans;
      }

      // Function to find the time gap
      function timeGap(st, et) {
        let t1 = getTimeInSeconds(st);
        let t2 = getTimeInSeconds(et);

        let time_diff = t1 - t2 < 0 ? t2 - t1 : t1 - t2;

        return convertSecToTime(time_diff);
      }
      let st = results[0].booking_time;
      let et = moment().format('HH:mm:ss');
      let diff = timeGap(st, et);
      var split = diff.split(':'); // split it at the colons
      var minutes = +split[0] * 60 + +split[1];
      var hour = minutes / 60;

      connection.query(
        'SELECT * FROM parking WHERE parking_id = ?',
        [parking_id],
        function (err, results, fields) {
          var price = hour * results[0].parking_price;
          connection.query(
            'UPDATE booking SET booking_status = ?,booking_timeout = ?,booking_price = ? WHERE booking_id = ?',
            ['Finish', et, price, req.params['id']],
            function (err, results, fields) {
              res.json({ status: 'ok' });
            }
          );
        }
      );
    }
  );
});

// Admin
// Create Carparking
app.post('/api/createcarparking', function (req, res, next) {
  // const {titulo, director, year, rating} = req.body;

  var parking_name = req.body.name;
  var parking_name_th = req.body.name_th;
  var parking_quantity = req.body.quantity;
  var parking_count = req.body.count;
  var parking_price = req.body.price;
  var parking_status = req.body.status;
  var parking_img = req.body.img;
  var parking_detail = req.body.detail;
  var parking_locationurl = req.body.locationurl;

  connection.execute(
    'INSERT INTO parking (parking_name,parking_name_th,parking_quantity,parking_count,parking_price,parking_status,parking_img,parking_detail,parking_locationurl) VALUES (?,?,?,?,?,?,?,?,?)',
    [
      parking_name,
      parking_name_th,
      parking_quantity,
      parking_count,
      parking_price,
      parking_status,
      parking_img,
      parking_detail,
      parking_locationurl,
    ],
    function (err, results, fields) {
      if (err) {
        res.status(500);
        return;
      }
      // Loop find parking_id
      connection.query(
        'SELECT * FROM parking WHERE parking_name = ?',
        [parking_name],
        function (err, results, fields) {
          var parking_id = results[0].parking_id;
          // Loop parking lane
          for (let lane = 1; lane <= parking_count; lane++) {
            connection.execute(
              'INSERT INTO parking_detail (parking_id,parking_lane,parking_plate,parking_timein,parking_timeout,owner) VALUES (?,?,?,?,?,?)',
              [parking_id, lane, null, null, null, 22],
              function (err, results, fields) {
                if (err) {
                  res.json({ status: 'error', message: err });
                  return;
                }
              }
            );
          }
          res.json({ status: 'ok' });
        }
      );
    }
  );
});

// app.post('/api/createdetail', function (req, res, next) {
//   var lane = 1;
//   while (lane <= 5) {
//     connection.execute(
//       'INSERT INTO parking_detail (parking_id,parking_lane,parking_plate,parking_timein,parking_timeout,owner) VALUES (?,?,?,?,?,?)',
//       [99, lane, null, null, null, 22],
//       function (err, results, fields) {
//         if (err) {
//           res.json({ status: 'error', message: err });
//           return;
//         }
//         res.status(200).send({ message: results });
//         console.log('laneInSide', lane);
//       }
//     );
//     console.log(lane);
//     lane++;
//   }
// });

const PORT = process.env.PORT;
app.listen(6969, function () {
  console.log('Server is running on PORT:', PORT);
});
