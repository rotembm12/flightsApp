using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using flightsApi.Models;

namespace FlightsApp.Controllers
{
    public class AirportsController : ApiController
    {
        // GET: api/Airports
        [Route("api/Airports")]
        public List<Airports> Get()
        {
            return Airports.GetAirports();
        }

        // GET: api/Airports/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Airports
        public void Post([FromBody]string value)
        {
        }

        [Route("api/Airports")]
        public IHttpActionResult Post([FromBody]List<Airports> airports)
        {
            var isSucceeded = Airports.Insert(airports);
            if (isSucceeded)
            {
                return Json(new { message = "airports inserted correctly" });
            }
            else
            {
                return Json(new { error = "Something went wrong" });
            }
        }

        // PUT: api/Airports/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Airports/5
        public void Delete(int id)
        {
        }
    }
}
