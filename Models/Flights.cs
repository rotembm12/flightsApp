using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using flightsApi.Models.DAL;
namespace flightsApi.Models
{
	public class Flights
	{
		string arrival;
		string departure;
		string id;
		int price;
		Airports fromAirport;
		Airports toAirport;
		string routes;

		public static List<Flights> flightsList = new List<Flights>();

		public string Arrival { get => arrival; set => arrival = value; }
		public string Departure { get => departure; set => departure = value; }
		public string Id { get => id; set => id = value; }
		public int Price { get => price; set => price = value; }
		public Airports FromAirport { get => fromAirport; set => fromAirport = value; }
		public Airports ToAirport { get => toAirport; set => toAirport = value; }
		public string Routes { get => routes; set => routes = value; }

		public static List<Flights> Insert(Flights flight)
		{
			var db = new DbServices();
			return db.Insert(flight);
			
		}
		public static List<Flights> getFlights()
		{
			var db = new DbServices();
			return db.getFlights();
		}
		public static List<Flights> removeFlight(string id)
		{
			var db = new DbServices();
			return db.removeFlight(id);
		}
	}
}