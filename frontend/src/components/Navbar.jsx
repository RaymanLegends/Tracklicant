import React from 'react'
import { useState } from 'react'
import { PlusIcon, BriefcaseIcon } from 'lucide-react'
import { Link } from 'react-router'
import Sidebar from './Sidebar'

const Navbar = () => {

  const [sideBar, setSideBar] = useState(false);

  const handleSideBar = async() => {
    setSideBar(true);
  }

  const toggleSideBar = async() =>{
    setSideBar((prev) => !prev);
  }

  return (
    <>
      <header className="bg-base-300 border-b border-base-content/10 relative z-30">
        <div className="w-full px-6 md:px-[50px] py-4">
          <div className="flex items-center justify-between">
            
            {/* Left Trigger + Logo */}
            <div className="flex items-center gap-3">
              <button
                onMouseEnter={handleSideBar}
                onClick={toggleSideBar}
                className="p-2 rounded-lg bg-base-200 hover:bg-primary/20 hover:text-primary transition-all duration-200 border border-base-content/10 group cursor-pointer"
                title="Open menu"
              >
                <BriefcaseIcon className="size-6 text-primary group-hover:scale-110 transition-transform" />
              </button>

              <Link
                to="/"
                className="text-3xl font-bold text-primary font-mono tracking-tighter hover:opacity-90 transition-opacity"
              >
                Tracklicant
              </Link>
            </div>

            {/* Right Action */}
            <div className="flex items-center gap-4">
              <Link 
                to="/create" 
                className="btn btn-primary btn-sm md:btn-md gap-2 font-medium shadow-xs hover:shadow-md transition-all duration-200"
              >
                <PlusIcon className="size-4 md:size-5" />
                <span>New Application</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Render the Sidebar component */}
      <Sidebar isOpen={sideBar} setIsOpen={setSideBar} />
    </>
  );
}

export default Navbar
