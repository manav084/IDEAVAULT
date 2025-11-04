"use client"
import React, { useEffect, useState } from 'react';
import IdeaCard from './IdeaCard';



const IdeaList = ({routeIdeas}) => {


  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {routeIdeas.map((idea) => (
        <IdeaCard key={idea._id} idea={idea} />
      ))}
    </div>
  );
};

export default IdeaList;