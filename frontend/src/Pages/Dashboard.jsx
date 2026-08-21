import React from 'react'
import {useState, useEffect} from "react";
import NavBar from "../components/Navbar.jsx"
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import axios from 'axios';
import toast from "react-hot-toast";
import Jobcard from "../components/Jobcard.jsx";
import api from '../lib/axios.js';
import AppsNotFound from "../components/AppsNotFound.jsx";

const Dashboard = () => {

  const [isRateLimited, setIsRateLimited] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async() => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
        setIsRateLimited(false);
        console.log(res.data);
      } catch (error) {
        console.log("Error fetching data");
        if(error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load job apps");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading...</div>}

        {jobs.length === 0 && !isRateLimited && <AppsNotFound/>}

        {jobs.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div key={job._id}>
                <Jobcard key={job._id} job={job} setJobs={setJobs}/>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard
