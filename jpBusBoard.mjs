import fetch from "node-fetch";
import readline from "readline-sync";

const apikey = process.env.NODE_TFL_API_KEY;

async function fetchDataFromApi(url) {
  const busArrivalResponse = await fetch (url);
  const arrivalPrediction = await busArrivalResponse.json();

  return arrivalPrediction;
}

async function getArrivalPredictions(busStopCode) {
  const arrivalPrediction = await fetchDataFromApi(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals?=${apikey}`);
  for(let i=0; i < arrivalPrediction.length && i<5; i++){
    let nextBus = arrivalPrediction[i].lineName;
    let nextBusArrival = arrivalPrediction[i].timeToStation;
        
    let timeString = arrivalInMins(nextBusArrival);
    console.log(`${i+1} - Bus Number ${nextBus} arrives in ${nextBusArrival} seconds (${timeString})` );
  }
}

function arrivalInMins(timeInSeconds) {
  let timeInMinutes = Math.floor(timeInSeconds/60);
  let secondsLeft = Math.floor(timeInSeconds % 60);
  let timeString = `${timeInMinutes} minutes, ${secondsLeft} seconds`;
  return timeString;
}

async function busBoard() {
  const busStopCode = '490008660N';
  getArrivalPredictions(busStopCode);
}

busBoard();