import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className='max-w-screen-2xl mx-auto bg-gradient-to-b from-gray-900 to-gray-700 min-h-screen'>

    {/* <div className='max-w-screen-2xl mx-auto bg-gradient-to-b from-gray-900 to-gray-700'> */}
      {/* <Header /> */}
      {/* 136 pixels minus viewport height */}
      <div className='min-h-[calc(100vh-136px)]'>
        <Outlet /> {/* This will render the appropriate child component */}
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
