using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Data.SqlClient;
using System.Data;
using flightsApi;
using System.Text;


namespace flightsApi.Models.DAL
{
    public class DbServices
    {
        public SqlConnection connect(String conString)
        {
            // read the connection string from the configuration file with the constring name
            string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;

            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        public List<Airports> getAirports()
        {
            List<Airports> airports = new List<Airports>();
            SqlConnection con = null;
            try
            {
                con = connect("DbConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Airports_2020";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Airports airport = new Airports();
                    airport.Id = dr["AirportId"].ToString();
                    airport.AirportName = (string)dr["AirportName"];
                    airport.AirportCode = (string)dr["AirportCode"];
                    airport.AirportCity = (string)dr["AirportCity"];
                    airport.AirportCountry = (string)dr["AirportCountry"];
                    airport.AirportLat = (string)dr["AirportLat"];
                    airport.AirportLong = (string)dr["AirportLong"];

                    airports.Add(airport);
                }

                return airports;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public int Insert(List<Airports> airports)
        {
            SqlConnection sqlCon;
            SqlCommand cmd;
            int numEffected = 0;
            //Open db connection
            try
            {
                sqlCon = connect("DbConnectionString");
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            foreach (Airports airport in airports)
            {
                //building the sql query 
                string insertCmdStr = BuildInsertCmd(airport);
                cmd = CreateCommand(insertCmdStr, sqlCon);

                //execute the command
                try
                {
                    numEffected += cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                    {
                        sqlCon.Close();
                    }
                    throw (ex);
                }
            }
            //close connection
            if (sqlCon != null)
            {
                sqlCon.Close();
            }
            return numEffected;
        }

        public List<Flights> getFlights()
        {
            var flights = new List<Flights>();
            SqlConnection con = null;
            try
            {
                con = connect("DbConnectionString"); // create a connection to the database using the connection String defined in the web config file

                string selectSTR = "select * from Flights_2020 left join Airports_2020 On Flights_2020.FromAirportId = Airports_2020.AirportId Left join Airports_2020 as airport2 on Flights_2020.ToAirportId = airport2.AirportId";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // create a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    var flight = new Flights();
                    flight.Id = dr[0].ToString();
                    flight.Arrival = (string)dr[1];
                    flight.Departure = (string)dr[2];
                    flight.Price = Int32.Parse((string)dr[3]);
                    if(dr[6] != null)
                        flight.Routes = (string)dr[6];

                    var airport1 = new Airports();
                    airport1.Id = ((int)dr[7]).ToString();
                    airport1.AirportName = (string)dr[8];
                    airport1.AirportCity = (string)dr[9];
                    airport1.AirportCountry = (string)dr[10];
                    airport1.AirportLat = (string)dr[11];
                    airport1.AirportLong = (string)dr[12];
                    airport1.AirportCode = (string)dr[13];
                    flight.FromAirport = airport1;

                    var airport2 = new Airports();
                    airport2.Id = ((int)dr[14]).ToString();
                    airport2.AirportName = (string)dr[15];
                    airport2.AirportCity = (string)dr[16];
                    airport2.AirportCountry = (string)dr[17];
                    airport2.AirportLat = (string)dr[18];
                    airport2.AirportLong = (string)dr[19];
                    airport2.AirportCode = (string)dr[20];
                    flight.ToAirport = airport2;

                    
                    flights.Add(flight);
                }

                return flights;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public List<Flights> Insert(Flights flight)
        {
            SqlConnection sqlCon;
            SqlCommand cmd;
            int numEffected;
            //Open db connection
            try
            {
                sqlCon = connect("DbConnectionString");
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            
            //building the sql query 
            string insertCmdStr = BuildInsertCmd(flight);
            cmd = CreateCommand(insertCmdStr, sqlCon);

            //execute the command
            try
            {
                numEffected = cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                if (sqlCon != null)
                {
                    sqlCon.Close();
                }
                throw (ex);
            }
            
            //close connection
            if (sqlCon != null)
            {
                sqlCon.Close();
            }
            return getFlights();
        }
        public List<Flights> removeFlight(string id)
        {
            SqlConnection sqlCon;
            SqlCommand cmd;
            int numEffected = 0;
            //Open db connection
            try
            {
                sqlCon = connect("DbConnectionString");
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            //building the sql query 
            string deleteCmd = BuildDeleteCmd(id);
            cmd = CreateCommand(deleteCmd, sqlCon);
            try
            {
                numEffected = cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw (ex);            
            }
            //close connection
            if (sqlCon != null)
            {
                sqlCon.Close();
            }
            return getFlights();
        }

        private string BuildInsertCmd(Airports airport)
        {
            string prefix = "INSERT INTO Airports_2020 (AirportName, AirportCountry, AirportCity, AirportLong, AirportLat, AirportCode) ";
            string cmdValues = string.Format("VALUES ('{0}','{1}','{2}','{3}','{4}', '{5}')", airport.AirportName, airport.AirportCountry, airport.AirportCity, airport.AirportLong, airport.AirportLat, airport.AirportCode);
            return prefix + cmdValues;
        }

        private string BuildInsertCmd(Flights flight)
        {
            string prefix = "INSERT INTO Flights_2020 (Arrival, Departure, Price, FromAirportId, ToAirportId, Routes) ";
            string cmdValues = string.Format("VALUES ('{0}','{1}','{2}',{3},{4},'{5}')", flight.Arrival, flight.Departure, flight.Price, flight.FromAirport.Id, flight.ToAirport.Id, flight.Routes);
            return prefix + cmdValues;
        }

        private string BuildDeleteCmd(string id)
        {
            string cmd = "DELETE FROM Flights_2020 WHERE Id = " + id;
            return cmd;
        }

        private SqlCommand CreateCommand(string CommandSTR, SqlConnection con)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object
            cmd.Connection = con;              // assign the connection to the command object
            cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 
            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds
            cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure
            return cmd;
        }
    }
}