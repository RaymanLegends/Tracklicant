import React from 'react';
import { HammerIcon, ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router';
import Navbar from '../components/Navbar';

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="bg-base-100 p-8 rounded-2xl border border-base-content/10 max-w-md w-full shadow-sm flex flex-col items-center space-y-4">
          <HammerIcon className="size-12 text-warning animate-pulse" />
          
          <h1 className="text-2xl font-bold font-mono">Under Construction</h1>
          
          <p className="text-base-content/70 text-sm">
            This page is currently being built. Check back soon!
          </p>

          <Link to="/" className="btn btn-primary btn-sm gap-2 mt-4">
            <ArrowLeftIcon className="size-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;