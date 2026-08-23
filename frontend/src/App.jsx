import React from 'react'
import {Routes, Route} from 'react-router';
import Dashboard from "./Pages/Dashboard.jsx"
import Create from "./Pages/CreatePage.jsx"
import JobDetails from "./Pages/JobDetails.jsx"
import toast from "react-hot-toast"
import UnderConstruction from './Pages/UnderConstruction.jsx';

const App = () => {
  return (
    <div>
      <Routes>
      <Route path = "/" element = {<Dashboard/>}/>
      <Route path = "/create" element = {<Create/>}/>
      <Route path = {`/job/:id`} element = {<JobDetails/>}/>

      <Route path = {`/analytics`} element = {<UnderConstruction/>}/>
      <Route path = {`/settings`} element = {<UnderConstruction/>}/>
      </Routes>
    </div>
  )
}

export default App
