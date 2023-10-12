import fetch from "node-fetch";
import readline from "readline-sync";

const apikey = process.env.NODE_TFL_API_KEY;

async function busBoard() {
//   const busStopCode = '490008660N';
  const busStopCode = getUserInput();

	const busArrivalResponse = await fetch (`https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals?=${apikey}`);
  const arrivalPrediction = await busArrivalResponse.json();

  for(let i=0; i < arrivalPrediction.length && i<5; i++){
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