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
        
    let timeString = arrivalInMins(nextBusArrival);
    console.log(`${i+1} - Bus Number ${nextBus} arrives in ${nextBusArrival} seconds (${timeString})` );
  }
}

function getUserInput() {
  console.log("Please enter a stop code: ");
	return readline.prompt();
}

function arrivalInMins(timeInSeconds) {
	let timeInMinutes = Math.floor(timeInSeconds/60);
	let secondsLeft = Math.floor(timeInSeconds % 60);
	let timeString = `${timeInMinutes} minutes, ${secondsLeft} seconds`;
	return timeString;
}

busBoard();