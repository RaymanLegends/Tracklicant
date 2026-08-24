import React from 'react'
import {Routes, Route} from 'react-router';
import Dashboard from "./Pages/Dashboard.jsx"
import Create from "./Pages/CreatePage.jsx"
import JobDetails from "./Pages/JobDetails.jsx"
import toast from "react-hot-toast"
import UnderConstruction from './Pages/UnderConstruction.jsx';
import ExploreJobs from './Pages/ExploreJobs.jsx';
import Breweries from "./Pages/Breweries.jsx"

const App = () => {
  return (
    <div>
      <Routes>
      <Route path = "/" element = {<Dashboard/>}/>
      <Route path = "/create" element = {<Create/>}/>
      <Route path = {`/job/:id`} element = {<JobDetails/>}/>

      <Route path = {`/analytics`} element = {<UnderConstruction/>}/>
      <Route path = {`/settings`} element = {<UnderConstruction/>}/>
      <Route path = {`/explore`} element = {<ExploreJobs/>}/>
      <Route path = {`/breweries`} element = {<Breweries/>}/>
      </Routes>
    </div>
  )
}

export default App
