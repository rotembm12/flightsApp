using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using flightsApi.Models.DAL;
namespace flightsApi.Models
{
    public class Airports
    {
        string id;
        string airportName;
        string airportCountry;
        string airportCity;
        string airportLong;
        string airportLat;
        string airportCode;

        public string AirportName { get => airportName; set => airportName = value; }
        public string AirportLong { get => airportLong; set => airportLong = value; }
        public string AirportLat { get => airportLat; set => airportLat = value; }
        public string AirportCountry { get => airportCountry; set => airportCountry = value; }
        public string AirportCity { get => airportCity; set => airportCity = value; }
        public string AirportCode { get => airportCode; set => airportCode = value; }
        public string Id { get => id; set => id = value; }

        public static bool Insert(List<Airports> airports)
        {
            if (airports.Count > 0)
            {
                DbServices db = new DbServices();
                var rowsAffected = db.Insert(airports);
                if (rowsAffected != airports.Count)
                {
                    return false;
                }
                return true;
            }
            return false;
        }
        public static List<Airports> GetAirports()
        {
            DbServices db = new DbServices();
            List<Airports> airports = db.getAirports();
            return airports;
        }
    }
}