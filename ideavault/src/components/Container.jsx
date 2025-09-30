import React from 'react'

const Container = ({children}) => {
  return (
    <div className='w-full h-full pt-20 flex justify-center items-center '>
      {
        children
      }
      
    </div>
  )
}

export default Container