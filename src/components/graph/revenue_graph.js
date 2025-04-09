import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const RevenueGraph = () => {
  const data = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue 2024",
        data: [50, 150, 300, 250, 450, 200, 300, 400, 500],
        borderColor: "rgba(59, 130, 246, 1)", // Tailwind's blue-500
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: "Revenue 2023",
        data: [20, 100, 150, 200, 250, 200, 280, 350, 420],
        borderColor: "rgba(168, 85, 247, 1)", // Tailwind's purple-500
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false, // Allows custom height and width
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB", // Tailwind's gray-300
        },
      },
      x: {
        grid: {
          color: "#E5E7EB", // Tailwind's gray-300
        },
      },
    },
  };

  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Revenue Graph</h2>
      <div className="h-60">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueGraph;






// import React from "react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// const RevenueGraph = () => {
//   const data = {
//     labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     datasets: [
//       {
//         label: "Revenue 2024",
//         data: [50, 150, 300, 250, 450, 200, 300, 400, 500],
//         borderColor: "rgba(59, 130, 246, 1)", // Tailwind's blue-500
//         backgroundColor: "transparent",
//         tension: 0.4,
//       },
//       {
//         label: "Revenue 2023",
//         data: [20, 100, 150, 200, 250, 200, 280, 350, 420],
//         borderColor: "rgba(168, 85, 247, 1)", // Tailwind's purple-500
//         backgroundColor: "transparent",
//         tension: 0.4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: "#E5E7EB", // Tailwind's gray-300
//         },
//       },
//       x: {
//         grid: {
//           color: "#E5E7EB", // Tailwind's gray-300
//         },
//       },
//     },
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-lg font-semibold mb-4">Revenue Graph</h2>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default RevenueGraph;
