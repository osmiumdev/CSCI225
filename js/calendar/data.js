//Firebase Interactor Script v1.0
//No currently known bugs. Written by Matt.
//Utilizes the Callback concept to avoid using promises, awaits, etc.

const firebaseConfig = {
  apiKey: 'AIzaSyDFVgbRrE_jaSay31ZArEUvr_N-9rHwkKI',

  authDomain: 'calendar-307ed.firebaseapp.com',

  projectId: 'calendar-307ed',

  storageBucket: 'calendar-307ed.appspot.com',

  messagingSenderId: '173936163883',

  appId: '1:173936163883:web:3046ab7c68188c703abe6e',
};

var db = null;
var user = null;

function initializeDatabase() {
  //This function is called after the page is fully loaded,
  //and other scripts are ready to acquire data (events)
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}

function retrieveAllEvents(callback, data) {
  //Passes an array of eventObjects to the callback function.

  var returnable = [];
  db.collection('events')
    .get()
    .then((querySnapshot) => {
      var map = querySnapshot.docs.map((doc) => {
        return { id: doc.id, data: doc.data() };
      });
      console.log(map);

      for (var i = 0; i < map.length; i++) {
        var eventObject = map[i]['data'];
        eventObject.doc = map[i]['id'];
        returnable.push(eventConverter.fromFirestoreBasic(eventObject));
      }

      callback(returnable, data);
    });
}

function addEvent(event) {
  //Adds an eventObject to the firestore.
  db.collection('events').doc().withConverter(eventConverter).set(event);
}

function addEventCallback(event,callback) {
  //Adds an eventObject to the firestore.
  db.collection('events').doc().withConverter(eventConverter).set(event);
  callback();
}

function deleteEvent(eventObject) {
  //Deletes an eventObject from the firestore.
  db.collection('events').doc(eventObject['doc']).delete();
}

class eventObject {
  //Event object.
  constructor(doc, name, sDate, eDate, color, desc, owner, rsvps, comms) {
    this.doc = doc;
    this.name = name; //String Event Name
    this.sDate = sDate; //DateObject
    this.eDate = eDate; //DateObject
    this.color = color; //String Hex Code
    this.desc = desc; //String Description
    this.owner = owner; //String Username
    this.rsvps = rsvps; //StringArray Usernames
    this.comms = comms; //CommentArray of CommentObjects
  }
}

class commentObject {
  //Comment object.
  constructor(poster, pDate, text) {
    this.poster = poster; //Username of the original poster.
    this.pDate = pDate; //Date and time object of who posted it.
    this.text = text; //Comment string.
  }
}

function commentArrayToFirestore(comments) {
  //Converts an array of comment objects into a firebase compatible array.
  //{ comment, comment, comment }
  var returnable = [];
  for (var i = 0; i < comments.length; i++) {
    returnable.push({
      poster: comments[i]['poster'],
      pDate: dateToFirestore(comments[i]['pDate']),
      text: comments[i]['text'],
    });
  }

  return returnable;
}

function fromFirestoreToCommentArray(comments) {
  //Converts a firestore comment array into an array of comment objects.
  var returnable = [];

  for (var i = 0; i < comments.length; i++) {
    returnable.push(
      new commentObject(comments[i].poster, comments[i].pDate, comments[i].text)
    );
  }

  return returnable;
}

const eventConverter = {
  //Object for FireStore which converts an Event object into compatible FireStore document, and vice versa.
  toFirestore: function (event) {
    return {
      doc: event.doc,
      name: event.name,
      sDate: event.sDate.toString(),
      eDate: event.eDate.toString(),
      color: event.color,
      desc: event.desc,
      owner: event.owner,
      rsvps: event.rsvps,
      comms: commentArrayToFirestore(event.comms),
    };
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new eventObject(
      data.doc,
      data.name,
      new Date(data.sDate),
      new Date(data.eDate),
      data.color,
      data.desc,
      data.owner,
      data.rsvps,
      fromFirestoreToCommentArray(data.comms)
    );
  },

  fromFirestoreBasic: function (data) {
    return new eventObject(
      data.doc,
      data.name,
      new Date(data.sDate),
      new Date(data.eDate),
      data.color,
      data.desc,
      data.owner,
      data.rsvps,
      fromFirestoreToCommentArray(data.comms)
    );
  },
};

//Auth
function createUser(username, password, callback) {
  //Creates a user with the given username and password, and returns the result to the callback function.
  firebase
    .auth()
    .createUserWithEmailAndPassword(username, password)
    .then((userCredential) => {
      console.log(userCredential.user.email + 'created and signed in!');
      callback(true, userCredential.user.email);
    })
    .catch((error) => {
      console.log('Error creating user!');
      console.log(error.code);
      console.log(error.message);
      callback(false);
    });
}

function signinUser(username, password, callback) {
  //Signs in the user, and returns the result to the callback function.
  firebase
    .auth()
    .signInWithEmailAndPassword(username, password)
    .then((userCredential) => {
      console.log(userCredential.user.email + ' signed in!');
      callback(true, userCredential.user.email);
    })
    .catch((error) => {
      console.log('Error signing in user!');
      console.log(error.code);
      console.log(error.message);
      callback(false);
    });
}

function logoutUser(callback) {
  //Logs out the currently signed in user.
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('Signed Out User');
      callback(true, 'null');
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      callback(false);
    });
}

function loginCallback(bool, data) {
  //If the login/logout functions worked successfully, this function is calledback to do things.
  //This is for the testing script.
  console.log('Auth Result: ' + bool);
  if (bool) {
    document.getElementById('signedInUser').innerHTML = data;
  } else {
    document.getElementById('signedInUser').innerHTML = 'null';
  }
}
/////////
//Testing
/////////
testDate = new Date(2022, 12, 6, 20, 46, 30);
testComment = new commentObject('osmiumdev', testDate, 'comment text!');
testRSVPs = ['user1', 'user2', 'user3'];
testEvent = new eventObject(
  '',
  'Event Name',
  testDate,
  testDate,
  '#FFFFFF',
  'Text Description',
  'osmiumdev',
  testRSVPs,
  [testComment, testComment]
);

var selectedEvent = null;

function printEvents(events) {
  var list = document.getElementById('eventList');
  list.innerHTML = '';
  for (var i = 0; i < events.length; i++) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(events[i].doc));
    li.setAttribute('onclick', "alert('blah');");
    list.appendChild(li);
  }
}

function selectEvent(events, event) {
  //Testing function for printing event information to screen.
  var span = document.getElementById('selectedEvent');
  var eventId = document.getElementById('eventId').value;
  if(events == null){
    console.log("Events Null, initiating callback!");
    retrieveAllEvents(selectEvent, event)

  } else if(event != null){
    console.log("Events Found, searching...");
    for (var i = 0; i < events.length; i++) {
      console.log("EventList " + i + ": " + events[i].doc);
      console.log("Passed Doc ID: " + event)
      if (events[i].doc.trim() == event.trim()) {
        console.log("Found Event with ID: " + eventId);
        selectedEvent = events[i];
        span.innerHTML = "Selected Event Info: "+
        "<br />ID:"+events[i].doc+
        "<br />Name:"+events[i].name+
        "<br />Start Date:"+events[i].sDate+
        "<br />End Date:"+events[i].eDate+
        "<br />Color Selected:"+events[i].color+
        "<br />Description:"+events[i].desc+
        "<br />Creator of Event:"+events[i].owner+
        "<br />RSVPs:"+events[i].rsvps;
        //creation of event details screen piggybacked on select event
        console.log('Event Selected: ' + eventId);
        console.log(events[i]);
        return;
      }
    }
  
    selectedEvent = null;
    span.innerHTML = 'Selected Event Info: null';
    console.log('No Event Found');

  } else {

    console.log("Events Found, searching...");
    for (var i = 0; i < events.length; i++) {
      if (events[i].doc.trim() == eventId.trim()) {
        console.log("Found Event with ID: " + eventId);
        selectedEvent = events[i];
        span.innerHTML = "Selected Event Info: "+
        "<br />ID:"+events[i].doc+
        "<br />Name:"+events[i].name+
        "<br />Start Date:"+events[i].sDate+
        "<br />End Date:"+events[i].eDate+
        "<br />Color Selected:"+events[i].color+
        "<br />Description:"+events[i].desc+
        "<br />Creator of Event:"+events[i].owner+
        "<br />RSVPs:"+events[i].rsvps;
        //creation of event details screen piggybacked on select event
        console.log('Event Selected: ' + eventId);
        console.log(events[i]);
        return;
      }
    }
  
    selectedEvent = null;
    span.innerHTML = 'Selected Event Info: null';
    console.log('No Event Found');

  }

}

function deleteAllEvents(events) {
  for (var i = 0; i < events.length; i++) {
    deleteEvent(events[i]);
  }
}

function drawCalendar(events){
  console.log(events);
  document.getElementById('caleandar').innerHTML = "";
  caleandar(document.getElementById('caleandar'), events, {});

}

initializeDatabase();
retrieveAllEvents(drawCalendar, null);