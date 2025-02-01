import React from 'react'


export default function Summary() {
  return (
    <>
        <div className="flex flex-col flex-grow bg-slate-200 font-geist p-4">
            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center sm:text-left">
                Welcome to the Student Dashboard
              </h2>
              <h3 className="text-sm sm:text-base lg:text-lg text-center sm:text-left">
                This is your Dashboard where you can see details about MCS Mess bill.
              </h3>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-center">
                here the mess bill detail will come
            </div>
        </div>
    </>
  )
}
