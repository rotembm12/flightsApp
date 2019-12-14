const app = {
    myFlights: []
};
const fromSelect = document.getElementById('fromDest');
const toSelect = document.getElementById('toDest');
const fromDate = document.getElementById('flightDateFrom');
const toDate = document.getElementById('flightDateTo');
const routesFilter = document.getElementById('routesFilter');

let cachedSearch = {
    from: "",
    to: "",
    dateFrom: "",
    dateTo: "",
    flights: []
};

getMyFlights();
getAirportsFromDb();

document
    .getElementById("showMyFlights")
    .addEventListener("click", renderMyFlights);

fromSelect.onchange = () => {
    const selectedOpt = fromSelect.options[fromSelect.selectedIndex];
    app["fromDest"] = {
        code: selectedOpt.code,
        db: selectedOpt.dbId
    };
    console.log("%cApp.fromDest has been updated", "color: blue; font-size: 16px");
    console.log(app);
}
toSelect.onchange = () => {
    const selectedOpt = toSelect.options[toSelect.selectedIndex];
    app["toDest"] = {
        code: selectedOpt.code,
        db: selectedOpt.dbId
    };
    console.log("%cApp.toDest has been updated", "color: blue; font-size: 16px");
    console.log(app);

}
fromDate.onchange = () => {
    const val = fromDate.value;
    if (val === "" || !val) {
        app["fromDate"] = "";
    } else app["fromDate"] = formatDate(val);
   
    console.log("%cApp.fromDate has been updated", "color: blue; font-size: 16px");
    console.log(app);
}
toDate.onchange = () => {
    const val = toDate.value;
    if (val === "" || !val) {
        app["toDate"] = "";
    } else app["toDate"] = formatDate(val);
 
    console.log("%cApp.toDate has been updated", "color: blue; font-size: 16px");
    console.log(app);
}
routesFilter.onchange = () => {
    const val = routesFilter.value;
    app.routesFilter = val;
}

async function getAirportsFromDb() {
    const response = await fetch('../api/Airports');
    const airports = await response.json();

    for (let i = 0; i < airports.length; i++) {
        const option = document.createElement('option');
        option.value = airports[i].AirportCode;
        option.innerText = airports[i].AirportCode + " - " + airports[i].AirportCountry;
        option.dbId = airports[i].Id;
        option.code = airports[i].AirportCode;
        fromSelect.appendChild(option);

        const option2 = document.createElement('option');
        option2.value = airports[i].AirportCode;
        option2.innerText = airports[i].AirportCode + " - " + airports[i].AirportCountry;
        option2.dbId = airports[i].Id;
        option2.code = airports[i].AirportCode;
        toSelect.appendChild(option2);
    }
    app.airports = airports;
    app.fromDest = {
        code: fromSelect.options[fromSelect.selectedIndex].code,
        db: fromSelect.options[fromSelect.selectedIndex].dbId
    }
    app.toDest = {
        code: toSelect.options[toSelect.selectedIndex].code,
        db: toSelect.options[toSelect.selectedIndex].dbId
    }
    console.log("Airports has been added to app obj");
}

async function onBtnClick() {
    const partner = "rotem";
    const { fromDest, toDest, fromDate, toDate } = app;

    if (fromDest === "" || toDest === "" || fromDate === "" || toDate === "")
        return alert("please fill all form fields before searching flights");
    
    const url = `https://api.skypicker.com/flights?to_type=city&flyFrom=${fromDest.code}&to=${toDest.code}&dateFrom=${fromDate}&dateTo=${toDate}&partner=${partner}`;

    try {
        if (
            cachedSearch.from === fromDest &&
            cachedSearch.to === toDest &&
            cachedSearch.dateFrom === fromDate &&
            cachedSearch.dateTo === toDate &&
            cachedSearch.flights.length > 0
        ) {
            buildFlightsCards(cachedSearch.flights);
        } else {
            const response = await fetch(url, {
                method: "GET"
            });

            const res = await response.json();
            if (!res.data) {
                return alert("no flights to show");
            }
            if (res.data.length === 0) {
                return alert("no flights to show");
            }
            cachedSearch.flights = res.data;
            cachedSearch.from = fromDest;
            cachedSearch.to = toDest;
            cachedSearch.dateFrom = fromDate;
            cachedSearch.dateTo = toDate;
            buildFlightsCards(cachedSearch.flights);
        }
    } catch (err) {
        console.log(err);
    }

    function buildFlightsCards(flightsData) {
        const mainContainer = document.getElementById("flightsList");
        mainContainer.innerHTML = "";
        flightsData.forEach((flight, index) => {
            const div = document.createElement("div");
            div.classList.add("col-4", "justify-content-center");
            const card = document.createElement("div");
            card.classList.add(
                "card",
                "m-3",
                "text-center",
                "justify-content-center"
            );
            card.id = index;
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            const cardTitle = document.createElement("h5");
            cardTitle.classList.add("card-title");
            cardTitle.innerText += `Price: ${flight.conversion.EUR} EURO `;
            const dep = document.createElement("h5");
            const arr = document.createElement("h5");
            dep.classList.add("card-subtitle", "text-left");
            arr.classList.add("card-subtitle", "text-left", "mt-1");
            const depDate = new Date(flight.dTimeUTC * 1000)
                .toString()
                .substring(0, 24);
            const arrDate = new Date(flight.aTimeUTC * 1000)
                .toString()
                .substring(0, 24);
            dep.innerText = "Departure: " + depDate;
            arr.innerText = "Arrival: " + arrDate;
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(dep);
            cardBody.appendChild(arr);
            const routeList = document.createElement("ul");
            routeList.classList.add("text-left", "mt-1");
            routeList.innerHTML = "<h6>Routes: </h6>";
            flight.route.forEach(r => {
                routeList.innerHTML += `<li>From ${r.cityFrom} To ${r.cityTo} </li>`;
            });
            cardBody.appendChild(routeList);
            const addBtn = document.createElement("button");
            addBtn.innerText = "Add this flight";
            addBtn.classList.add("btn", "btn-outline-success");
            addBtn.id = `btn${index}`;
            addBtn.onclick = addFlight;
            if (app.myFlights && app.myFlights.length > 0) {
                app.myFlights.forEach(myFlight => {
                    if (myFlight.Id === flight.id) {
                        addBtn.innerText = "In List";
                        addBtn.classList.remove("btn-outline-success");
                        addBtn.classList.add("btn-info");
                    }
                });
            }
            cardBody.appendChild(addBtn);
            card.appendChild(cardBody);
            div.appendChild(card);

            const fromAirport = app.airports.filter(airport => {
                return airport.AirportCode === app.fromDest.code
            });

            const toAirport = app.airports.filter(airport => {
                return airport.AirportCode === app.toDest.code
            });
            if (fromAirport[0] && toAirport[0]) {
                card.flightData = {
                    //Card is HTML div element
                    id: flight.id,
                    price: flight.conversion.EUR,
                    routes: flight.route,
                    departure: depDate,
                    arrival: arrDate,
                    fromAirport: fromAirport[0],
                    toAirport: toAirport[0]
                };
            } 
            mainContainer.appendChild(div);
            index++;
        });
    }
}

function formatDate(input) {
    var datePart = input.match(/\d+/g),
        year = datePart[0],
        month = datePart[1],
        day = datePart[2];

    return day + "/" + month + "/" + year;
}

async function addFlight(event) {
    try {
        const card = document.getElementById(
            event.target.id.replace("btn", "")
        );
        const exists = app.myFlights.filter(
            flight => flight.Id == card.flightData.id
        );
        if (exists.length === 0) {
            const response = await fetch("../api/flights", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(card.flightData)
            });
            app.myFlights = await response.json();
            event.target.classList.remove("btn-outline-success");
            event.target.classList.add("btn-info");
            event.target.innerText = "In List";
            console.log(app.myFlights);
        } else {
            alert("That flight is already in your list");
        }
    } catch (err) {
        console.log(err);
    }
}

async function getMyFlights() {
    try {
        const response = await fetch('../api/Flights');
        const myFlights = await response.json();
        if (myFlights.length > 0) {
            app.myFlights = myFlights
            console.log("%cApp.myFlights has been updated", "color: Green; font-size: 16px");
            console.log(app);
        }
    } catch (err) {
        console.error(err);
    }
    //try {
    //    const routesFilter = document.getElementById("routesFilter").value;

    //    if (routesFilter === "") {
    //        const response = await fetch("../api/flights", {
    //            method: "GET"
    //        });
    //        myFlights = await response.json();
    //        console.log(myFlights);
    //    } else {
    //        const response = await fetch(
    //            `../api/flights/stop/${routesFilter}`,
    //            {
    //                method: "GET"
    //            }
    //        );
    //        myFlights = await response.json();
    //        console.log(myFlights);
    //    }
    //} catch (err) {
    //    console.log(err);
    //}
}

async function renderMyFlights() {
    await getMyFlights();
    document.getElementById("flightsList").innerHTML = "";
    console.log(app.myFlights);
    if (app.routesFilter) {
        console.log(app.routesFilter)
        return null;
    }
    if (app.myFlights.length > 0) {
        app.myFlights.forEach((flight, index) => {
            //flight = { arr, dep, fromAp, toAp, price }
            const div = document.createElement("div");
            div.classList.add("col-12", "justify-content-center", "p-2");

            const card = document.createElement("div");

            card.classList.add(
                "card",
                "m-3",
                "justify-content-center"
            );
            const cardTitle = document.createElement("h6");
            cardTitle.classList.add("card-title",'text-left');
            cardTitle.innerText += `Price: ${flight.Price} EURO`;

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body", 'text-center');

            const travel = document.createElement("h5");
            travel.classList.add('mb-3', 'text-primary', 'text-center');
            travel.innerText = `Origin: ${flight.FromAirport.AirportCity} of ${flight.FromAirport.AirportCountry} - Destination: ${flight.ToAirport.AirportCity} of ${flight.FromAirport.AirportCountry}`;

            const dep = document.createElement("span");
            const arr = document.createElement("span");
            dep.classList.add("card-subtitle", "m-1");
            arr.classList.add("card-subtitle", "m-1");
            dep.innerHTML = "<strong>Departure:</strong> " + flight.Departure;
            arr.innerHTML = "<strong>Arrival:</strong> " + flight.Arrival;

            const mapPrev = document.createElement('h6');
            mapPrev.classList.add('mt-3', 'map-preview-link', 'text-center');
            mapPrev.innerHTML = `Map preview <img src="./map.png" />`;
            const row = document.createElement('div');
            row.classList.add('row', 'justify-content-center');

            const originMap = document.createElement('div');
            originMap.classList.add('col-6','p-1');

            const destMap = document.createElement('div');
            destMap.classList.add('col-6','p-1');
            row.appendChild(originMap);
            row.appendChild(destMap);

            mapPrev.onclick = () => {
                if (originMap.innerHTML !== "") {
                    originMap.innerHTML = "";
                    destMap.innerHTML = "";
                    originMap.style.height = "";
                    card.classList.remove('frame-preview');
                    return null;    
                }
                card.classList.add('frame-preview');
                const mapFrame1 = document.createElement('iframe');
                const lat = flight.FromAirport.AirportLat;
                const long = flight.FromAirport.AirportLong;
                mapFrame1.width = "100%";
                mapFrame1.height = "80%";
                mapFrame1.src = `https://maps.google.com/maps?q=${lat},${long}&output=embed&key=AIzaSyD9bBLk2EBBcWk48ogoq9YQJAIDT97BOe0`;
                const originTitle = document.createElement('h5');
                originTitle.classList.add('text-center');
                originTitle.innerText = "ORIGIN LOCATION";
                originMap.appendChild(originTitle);
                originMap.appendChild(mapFrame1);
                originMap.style.height = "400px";

                const mapFrame2 = document.createElement('iframe');
                const lat2 = flight.ToAirport.AirportLat;
                const long2 = flight.ToAirport.AirportLong;
                mapFrame2.width = "100%";
                mapFrame2.height = "80%";
                mapFrame2.src = `https://maps.google.com/maps?q=${lat2},${long2}&output=embed&key=AIzaSyD9bBLk2EBBcWk48ogoq9YQJAIDT97BOe0`;
                const destTitle = document.createElement('h5');
                destTitle.classList.add('text-center');
                destTitle.innerText = "DESTINATION LOCATION";
                destMap.appendChild(destTitle);
                destMap.appendChild(mapFrame2);
            }
            
            const routes = document.createElement("p");
            routes.classList.add("card-subtitle");
            //flight.Routes.forEach(route => {
            //    routes.innerHTML += `From ${route.cityFrom} To ${route.cityTo} <br/>`;
            //});

            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML =
                "DELETE <img src='./delete.png' alt='trash icon' />";
            deleteBtn.setAttribute("flight-Index", index);
            deleteBtn.classList.add("btn", "btn-danger");
            deleteBtn.onclick = deleteFlight;

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(travel);
            cardBody.appendChild(dep);
            cardBody.appendChild(arr);
            cardBody.appendChild(routes);
            cardBody.appendChild(mapPrev);
            cardBody.appendChild(row);
            card.appendChild(cardBody);
            card.appendChild(deleteBtn);

            card.flightData = flight;
            div.appendChild(card);



            document.getElementById("flightsList").appendChild(div);
        });
    } else {
        return alert("no flights to show");
    }

    async function deleteFlight(event) {
        const flightToDeleteId = event.target.parentElement.flightData.Id;
        const res = await fetch(`../api/flights/${flightToDeleteId}`, {
            method: "DELETE"
        });
        app.myFlights = await res.json();

        renderMyFlights();
    }
}
