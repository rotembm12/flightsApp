





//const url =
//    "https://api.skypicker.com/locations?type=dump&locale=en-US&location_types=airport&limit=4000&active_only=true&sort=name";
//const getAirports = async () => {
//    const response = await fetch(url);
//    const airports = await response.json();
//    return airports;
//};
//document
//    .getElementById("getAirportsBtn")
//    .addEventListener("click", async () => {
//        const airports = await getAirports();
//        console.log(airports.locations);
        
//        const filteredAirports = airports.locations.map(airport => {
//            const airportName = airport.name.replace("'", "");
//            const airportCountry = airport.city.country.name.replace("'", "");
//            const airportCity = airport.city.name.replace("'", "");
//            const filteredAirport = {
//                airportName,
//                airportCountry,
//                airportCity,
//                airportLong: airport.location.lon,
//                airportLat: airport.location.lat,
//                airportCode: airport.code
//            };
//            return filteredAirport;
//        });
//        try {
//            const response = await fetch(`../api/Airports`, {
//                method: "POST",
//                mode: "cors", // no-cors, *cors, same-origin
//                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//                credentials: "same-origin", // include, *same-origin, omit
//                headers: {
//                    "Content-Type": "application/json"
//                    // 'Content-Type': 'application/x-www-form-urlencoded',
//                },
//                body: JSON.stringify(filteredAirports)
//            });
//            const msg = await response.json();
//            console.log(msg);
//        } catch (err) {
//            console.error(err);
//        }
//    });
