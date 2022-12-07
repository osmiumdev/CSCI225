testdate=new Date(2022,11,24)

var events = [
    {'Date': testdate, 'name': 'Christmas Eve', },
    {'Date': new Date(2022, 11, 25), 'name': 'Christmas.', },
    {'Date': new Date(2022, 11, 27), 'name': 'Birthday.', },
  ];
  var settings = {};
  var element = document.getElementById('caleandar');
  caleandar(element, events, settings);