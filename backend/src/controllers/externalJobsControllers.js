import axios from "axios";

export const internPostings = async(req, res) => {
  try {
    const response = await axios.get("https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/dev/.github/scripts/listings.json");

    const activeJobs = response.data.filter((job) => {
      return job.active === true && job.is_visible !== false;
    })

    res.status(200).json(activeJobs);
  } catch (error) {
    console.log("error in externalJobRoutes.js: ", error);
    res.status(500).json({message:"internal error fetching internship data"});
  }
};

export const breweries = async(req,res) => {
  try {
    const response = await axios.get("https://api.openbrewerydb.org/v1/breweries?by_city=madison");

    const filteredBreweries = response.data.filter((brew) => {
      return Boolean(brew.name);
    });

    res.status(200).json(filteredBreweries);
  } catch (error) {
    console.log("couldn't fetch breweries: ", error);
    res.status(500).json({message:"internal error fetching breweries"});
  }
};