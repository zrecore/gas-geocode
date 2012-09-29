// Script-as-app template.
function doGet() {
  var app = this.buildAppUI();
  
  return app;
}

function getDataFormat() {
  return 'json'; // ...We could return json, or xml. But our example uses JSON... so yeah.
}

function getEndpointUrl() {
  return 'https://maps.googleapis.com/maps/api/geocode/' + this.getDataFormat(); // Assemble our endpoint URL..
}

function buildAppUI() {
  var app = UiApp.createApplication();
  
  var restEndpointUrl = this.getEndpointUrl();
  
  var addressLabel = app.createLabel('Address:')
      .setId('addressLabel');
  
  app.add(addressLabel); // Add the address label
  
  var address = app.createTextBox()
      .setId('addressInput')
      .setName('addressInput'); // Query by address
  
  app.add(address); // Add the address input

  var button = app.createButton('Search');
  app.add(button); // Add the "Search" button.

  
  var label = app.createLabel('The result:')
                 .setId('statusLabel');
  
  app.add(label);

  var handler = app.createServerHandler('searchButtonClick');
  handler.addCallbackElement(address);
  button.addClickHandler(handler);

  return app;
}


function searchButtonClick(e) {
  var app = UiApp.getActiveApplication();
  var url = this.getEndpointUrl();
  
  // Some kind of visual indication that we are doing something. Just show a label.
  var label = app.getElementById('statusLabel');
  
  // What address did we type in? Get it from the input!
  var address = e.parameter.addressInput; //app.getElementById('addressInput');
  
  // Retrieve the Google Maps JSON!
  url += "?sensor=false&address=" + encodeURIComponent(address);
  
  // Retrieve the JSON string from our endpoint URL, with some parameters.
  var jsonString = UrlFetchApp.fetch( url ).getContentText();
  
  // ...and parse it!
  var jsonData = Utilities.jsonParse(jsonString);
  
  // Let's list the data! (See https://developers.google.com/maps/documentation/geocoding/)
  var row = null;
  
  for (var i = 0; i < jsonData.results.length; i++) {
    row = jsonData.results[i];
    
    var entryLabel = app.createLabel(row.formatted_address + ' @ (' + row.geometry.location.lat + ', lng ' + row.geometry.location.lng + ')');
    app.add(entryLabel);
  }

  app.close();
  return app;
}
