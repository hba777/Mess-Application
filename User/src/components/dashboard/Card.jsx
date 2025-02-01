// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router';

// export default function Card({ name }) {
//   const [counts, setCounts] = useState({ taskNo: 0, routineNo: 0 });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const [tasksResponse, routineResponse] = await Promise.all([
//           axios.get('http://localhost:5001/tasks'),
//           axios.get('http://localhost:5001/routine'),
//         ]);
//         setCounts({
//           taskNo: tasksResponse.data.taskNo || 0,
//           routineNo: routineResponse.data.rCount || 0,
//         });
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchCounts();
//   }, []);

//   const handleNavigation = () => {
//     if (name.toLowerCase() === 'task') {
//       navigate('/dashboard/tasks');
//     } else if (name.toLowerCase() === 'routine') {
//       navigate('/dashboard/routine');
//     } else if (name.toLowerCase() === 'notes')
//       {
//       navigate('/dashboard/notes');
//     }
//   };

//   const itemCount =
//     name.toLowerCase() === 'task' ? counts.taskNo : counts.routineNo;

//   return (
//     <div className="bg-slate-50 p-4 rounded-lg shadow-lg flex flex-col items-start">
//       <h3 className="font-semibold">{name}</h3>
//       <p>
//         You have {itemCount} {name}
//         {itemCount !== 1 ? 's' : ''} pending.
//       </p>
//       <button
//         onClick={handleNavigation}
//         className="mt-4 bg-blue-500 text-white w-full p-1 rounded-md text-sm"
//       >
//         View {name}
//         {itemCount !== 1 ? 's' : ''}
//       </button>
//     </div>
//   );
// }
