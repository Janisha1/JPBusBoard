import fetch from "node-fetch";
import readline from "readline-sync";

const apikey = process.env.NODE_TFL_API_KEY;

function getUserInput(message){
  console.log(message);
  return readline.prompt();
}

async function fetchDataFromApi(url) {
  const response = await fetch (url);
  const jsonData = await response.json();

  return jsonData;
}

async function getLatLongFromPostcode(postcode) {
  const postcodeResponse = await fetchDataFromApi(`https://api.postcodes.io/postcodes/${postcode}`);
  const userLocation = {
    lat: postcodeResponse.result.latitude,
    lon: postcodeResponse.result.longitude,
  }
  return (userLocation);
}

async function getNearestBusStops(location) {
  const nearestBusStopsData = await fetchDataFromApi(`https://api.tfl.gov.uk/StopPoint/?lat=${location.lat}&lon=${location.lon}&stopTypes=NaptanPublicBusCoachTram&radius=500`);
  const nearestBusStops = nearestBusStopsData.stopPoints;
  nearestBusStops.sort((stopPointA, stopPointB) => stopPointA.distance - stopPointB.distance);
  const nearestTwoStops = nearestBusStops.slice(0,2);

  return nearestTwoStops.map((stopPoint) => {
    return {
      naptanId: stopPoint.naptanId,
      stopLetter: stopPoint.stopLetter,
      stopName: stopPoint.commonName,
      distance: stopPoint.distance,
    }
  });
}

async function getArrivalPredictions(busStopCode) {
  const arrivalPrediction = await fetchDataFromApi(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals?=${apikey}`);
  return arrivalPrediction;
}

function arrivalInMins(timeInSeconds) {
  let timeInMinutes = Math.floor(timeInSeconds/60);
  let secondsLeft = Math.floor(timeInSeconds % 60);
  let timeString = `${timeInMinutes} minutes, ${secondsLeft} seconds`;
  return timeString;
}

function displayBusArrivals(predictions, busStopName) {
  console.log(`\n Next arrivals at Bus Stop: ${busStopName}`);
  for(let i=0; i<predictions.length && i<5; i++) {
    const arrival = predictions[i];
    const timeInMinutes = arrivalInMins(arrival.timeToStation);
    console.log(`Bus Number ${arrival.lineName} arriving in ${timeInMinutes}`);
  }
}

async function busBoard() {
  const userInput = getUserInput("Please enter your postcode: ");
  const postcodeLocation = await getLatLongFromPostcode(userInput);
  const nearestBusStops = await getNearestBusStops(postcodeLocation);

  for(let i=0; i<2 && i<nearestBusStops.length; i++) {
    const busArrivalPredictions = await getArrivalPredictions(nearestBusStops[i].naptanId);
    displayBusArrivals(busArrivalPredictions, nearestBusStops[i].stopName);
  }
}

busBoard();