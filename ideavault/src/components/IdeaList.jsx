"use client"
import React, { useEffect, useState } from 'react'
 
const IdeaList = () => {
    const [list ,setList] = useState([])

    useEffect(() => {
      fetch(`/api/getIdea`).then((res)=>
           res.json()
      ).then((obj)=>setList(obj.data))
    
     
    }, [])
    
  return (
    <>
      <div>

         {
            list.map((val,index)=> (
                <div key={val._id}> 
                <h2>{val.title}</h2>
                <p>{val.description}</p>
                <section>{val.category}</section>
                <h3>{val.votes}</h3>
               
                    
                </div>
            ))
         }

      </div>

    </>
  )
}

export default IdeaList