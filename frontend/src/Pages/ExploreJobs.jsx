import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

// Import modules & theme from ag-grid-community
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

// 1. Register modules including ValidationModule (which unmasks error codes)
ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

// 2. Create the theme instance
const myTheme = themeQuartz.withPart(colorSchemeDark);

const ExploreJobs = () => {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const getJobListings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/external-jobs/internships");
        setRowData(res.data);
      } catch (error) {
        console.error("Error fetching job listings:", error);
        toast.error("Failed to load internships", { duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    getJobListings();
  }, []);

  const columnDefs = useMemo(
    () => [
      {
        field: "company_name",
        headerName: "Company",
        filter: "agTextColumnFilter",
        flex: 1.2,
        cellClass: "font-semibold",
      },
      {
        field: "title",
        headerName: "Role",
        filter: "agTextColumnFilter",
        flex: 1.5,
      },
      {
        field: "locations",
        headerName: "Location",
        filter: "agTextColumnFilter",
        flex: 1.3,
        valueFormatter: (params) => {
          if (!params.value) return "Remote / US";
          return Array.isArray(params.value) ? params.value.join(", ") : params.value;
        },
      },
      {
        field: "terms",
        headerName: "Term",
        width: 140,
        valueFormatter: (params) => {
          if (!params.value) return "Summer";
          return Array.isArray(params.value) ? params.value.join(", ") : params.value;
        },
      },
      {
        field: "date_posted",
        headerName: "Posted",
        width: 130,
        sort: "desc",
        sortIndex: 0,
        valueFormatter: (params) => {
          if (!params.value) return "Recent";
          return new Date(params.value * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        },
      },
      {
        headerName: "Apply",
        width: 110,
        cellRenderer: (params) => {
          const url = params.data?.url;
          if (!url) return null;
          return (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-xs text-primary underline"
            >
              Apply ↗
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
        <h1 className="text-2xl font-bold">Explore CS Internships</h1>

        {loading ? (
          <div className="flex justify-center items-center h-[600px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          /* Remove legacy 'ag-theme-quartz-dark' class from the container */
          <div className="w-full h-[600px] rounded-xl overflow-hidden shadow">
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
  );
};

export default ExploreJobs;