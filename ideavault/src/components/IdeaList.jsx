"use client"
import React, { useState } from 'react'
 
const IdeaList = () => {
    const [list ,setList] = useState([])
  return (
    <>
      <div>

         {
            list.map((val,index)=> (
                <div key={val._id}> 
                    
                </div>
            ))
         }

      </div>

    </>
  )
}

export default IdeaList