import fetch from "node-fetch";
import readline from "readline-sync";

async function busBoard() {
//   const busStopCode = '490008660N';
  const busStopCode = getUserInput();
  const busArrivalResponse = await fetch (`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals`);
  const arrivalPrediction = await busArrivalResponse.json();

  for(let i=0; i < arrivalPrediction.length; i++){
    let nextBus = arrivalPrediction[i].lineName;
    let nextBusArrival = arrivalPrediction[i].timeToStation;
        
    console.log(`${i+1} - Bus Number ${nextBus} arrives in ${nextBusArrival} seconds`);
        /* Experimenting turning time in seconds to time in minutes 
        arrivalInMins(arrivalPrediction[i].timeToStation);
        */
  }
}

function getUserInput() {
  console.log("Please enter a stop code: ");
	return readline.prompt();
}

busBoard();