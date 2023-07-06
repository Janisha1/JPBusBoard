import fetch from "node-fetch";

const busStop1 = '490008660N';

async function busBoard() {
    const busArrivalResponse = await fetch (`https://api.tfl.gov.uk/StopPoint/${busStop1}/Arrivals`);
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

busBoard();