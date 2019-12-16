using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using flightsApi.Models;


namespace flightsApp.Controllers
{
    public class flightsController : ApiController
    {
        // GET: api/flights
        public List<Flights> Get()
        {
			return Flights.getFlights();
			
        }

        // GET: api/flights/5
        public List<Flights> Get(int id)
        {
			return Flights.flightsList;
        }


		[Route("api/flights/stop/{city}")]
		public List<Flights> Get(string city)
		{
            List<Flights> flightList = Flights.getFlights();
            return flightList.Where(flight => flight.Routes.ToUpper().Contains(city.ToUpper())).ToList();
		
		}

		// POST: api/flights
		public List<Flights> Post([FromBody]Flights flight)
        {
			return Flights.Insert(flight);         
        }

        // PUT: api/flights/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/flights/5
        public List<Flights> Delete(string id)
        {
			return Flights.removeFlight(id);	
        }
    }
}