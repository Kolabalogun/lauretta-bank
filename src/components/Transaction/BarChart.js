import React from "react";
import { Bar } from "react-chartjs-2";
import SectionTitle from "../Typography/SectionTitle";

const BarChart = ({ transactions, userName }) => {
  const formatDate = (isoDate) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(isoDate).toLocaleDateString("en-US", options);
  };

  const data = {
    labels: transactions.map((transaction) => formatDate(transaction.date)),
    datasets: [
      {
        label: "Time Taken vs File Size",
        backgroundColor: "#0694a2",
        borderWidth: 1,
        data: transactions.map((transaction) => transaction.taketaken),
      },

      {
        label: "File Size",
        backgroundColor: "#7e3af2",
        borderWidth: 1,
        data: transactions
          .filter((transaction) => transaction.totalFileSize)
          .map((transaction) => transaction.totalFileSize),
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div>
      <SectionTitle className="text-lg font-semibold mb-4">
        {userName}
      </SectionTitle>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
