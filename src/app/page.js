"use client";

import { useState, useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import Promos from '../components/Promos.jsx';


export default function Home() {

  return (
    <div className=" min-h-screen" >
      
      {/* Hero Section */}
      <Hero />


      {/* promos Section */}


      <Promos />
    


     
    </div>
  );
}