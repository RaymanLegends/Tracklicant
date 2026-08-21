import React from 'react'
import {Routes, Route} from 'react-router';
import Dashboard from "./Pages/Dashboard.jsx"
import Create from "./Pages/CreatePage.jsx"
import JobDetails from "./Pages/JobDetails.jsx"
import toast from "react-hot-toast"

const App = () => {
  return (
    <div data-theme="cupcake">
      <Routes>
      <Route path = "/" element = {<Dashboard/>}/>
      <Route path = "/create" element = {<Create/>}/>
      <Route path = {`/job/:id`} element = {<JobDetails/>}/>
      </Routes>
    </div>
  )
}

export default App
