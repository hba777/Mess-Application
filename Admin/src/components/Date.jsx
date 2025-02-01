import React, { useState, useEffect } from 'react';

export default function DateComponent() {
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <div>
      <h3 className='font-mono font-semibold'>{dateTime}</h3>
    </div>
  );
}
