import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import {
  ModuleRegistry,
  AllCommunityModule,
  ValidationModule,
  themeQuartz,
  colorSchemeDark,
} from "ag-grid-community";

import api from "../lib/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

// Register modules
ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

// Create theme
const myTheme = themeQuartz.withPart(colorSchemeDark);

const Breweries = () => {

  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const getBreweries = async() => {
      try {
        setLoading(true);
        const res = await api.get("/external-jobs/breweries");
        setRowData(res.data);
      } catch (error) {
        console.log("Error in getting breweries: ", error);
        toast.error("Failed to load breweries", { duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    getBreweries();
  }, []);

  const columnDefs = useMemo(
    () => [
      {
        field: "name",
        headerName: "Brewery Name",
        filter: "agTextColumnFilter",
        flex: 1.5,
        cellClass: "font-semibold",
      },
      {
        field: "type",
        headerName: "Type",
        filter: "agTextColumnFilter",
        flex: 1,
      },
      {
        field: "city",
        headerName: "City",
        filter: "agTextColumnFilter",
        flex: 1,
      },
      {
        field: "state",
        headerName: "State",
        filter: "agTextColumnFilter",
        flex: 1,
      },
      {
        field: "website_url",
        headerName: "Website",
        flex: 1.2,
        cellRenderer: (params) => {
          const url = params.value;
          if (!url || url === "N/A") return <span className="text-gray-400">N/A</span>;
          return (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              Visit Website ↗
            </a>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-bold">Breweries Practice Grid</h1>

        {loading ? (
          <div className="flex justify-center items-center h-[500px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          /* Container must have explicit height & theme class */
          <div className="ag-theme-quartz-dark w-full h-[500px] rounded-xl overflow-hidden shadow">
            <AgGridReact
              theme={myTheme}
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={20}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Breweries
