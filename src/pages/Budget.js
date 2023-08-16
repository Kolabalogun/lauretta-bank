import React from "react";
import PageTitle from "../components/Typography/PageTitle";
import { useGlobalContext } from "../context/GlobalContext";
import InfoCard from "../components/Cards/InfoCard";
import RoundIcon from "../components/RoundIcon";
import { MoneyIcon } from "../icons";
import ChartCard from "../components/Chart/ChartCard";
import ChartLegend from "../components/Chart/ChartLegend";
import { Doughnut } from "react-chartjs-2"; // Import Doughnut from react-chartjs-2
import { doughnutLegends, doughnutOptions } from "../utils/demo/chartsData";

const Budget = () => {
  const { currentRegUser } = useGlobalContext();

  // Check if currentRegUser exists and has transactions
  if (!currentRegUser || !currentRegUser.transactions) {
    return null; // Handle the case when the data is not ready yet
  }

  // Calculate total money in and out from transactions
  const totalMoneyIn = currentRegUser.transactions.reduce(
    (total, transaction) =>
      transaction.type === "Credit" ? total + transaction.amount : total,
    0
  );

  const totalMoneyOut = currentRegUser.transactions.reduce(
    (total, transaction) =>
      transaction.type === "Debit"
        ? total + parseInt(transaction.amount)
        : total,
    0
  );

  // Doughnut chart data
  const doughnutData = {
    datasets: [
      {
        data: [totalMoneyIn, totalMoneyOut],
        backgroundColor: ["#0694a2", "#1c64f2"],
        label: "Transactions",
      },
    ],
    labels: ["Money In", "Money Out"],
  };

  return (
    <div>
      <PageTitle>Budget</PageTitle>

      <div className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span>{`Hello ${currentRegUser?.firstName}, Welcome to your Budget dashboard!`}</span>
        </div>
      </div>

      <div className="grid gap-6 my-8 md:grid-cols-2 ">
        <InfoCard title="Revenue" value={`N ${totalMoneyIn}`}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Expenses" value={`N ${totalMoneyOut}`}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-red-500 dark:text-red-100"
            bgColorClass="bg-red-100 dark:bg-red-500"
            className="mr-4"
          />
        </InfoCard>

        {/* Other InfoCards */}
      </div>

      <div className="grid gap-6 mb-8">
        <ChartCard title="Transactions">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Budget;
