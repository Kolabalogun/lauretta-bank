import React from "react";
import PageTitle from "../Typography/PageTitle";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

import { Button, CardBody, Card } from "@windmill/react-ui";
import InfoCard from "../Cards/InfoCard";
import RoundIcon from "../RoundIcon";
import { CartIcon, ChatIcon, MoneyIcon, PeopleIcon } from "../../icons";
import ChartCard from "../Chart/ChartCard";
import { Bar, Line } from "react-chartjs-2";
import { barLegends, lineLegends } from "../../utils/demo/chartsData";
import ChartLegend from "../Chart/ChartLegend";

const TransactionDetails = ({ transaction, setshowTransDetails }) => {
  // Calculate the time taken for the transaction in seconds
  const timeTakenInSeconds = transaction.taketaken.toFixed(1);

  // Prepare bar graph data
  const barOptions = {
    data: {
      labels: ["Time Taken and File Size Chart"],
      datasets: [
        {
          label: "Time Taken",
          backgroundColor: "#0694a2",
          // borderColor: window.chartColors.red,
          borderWidth: 1,
          data: [timeTakenInSeconds],
        },
        {
          label: "File Size",
          backgroundColor: "#7e3af2",
          // borderColor: window.chartColors.blue,
          borderWidth: 1,
          data: [transaction?.totalFileSize],
        },
      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle>Transaction Details</PageTitle>

        <Button onClick={() => setshowTransDetails(false)}>Go back</Button>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Recipient" value={transaction?.name}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Amount" value={`N ${transaction?.amount}`}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Category" value={transaction?.category}>
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Type" value={transaction?.type}>
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Date
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {transaction?.date}
            </p>
          </CardBody>
        </Card>

        <Card colored className="text-white bg-purple-600">
          <CardBody>
            <p className="mb-4 font-semibold">RSA Key</p>
            <p>{transaction?.rsaKey}</p>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-8 shadow-md">
        <CardBody>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The Chart below shows the time taken to complete this transaction.
            This involves the Encrytion and Decryption time against the File
            Size
          </p>
        </CardBody>
      </Card>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Bars">
          <Bar {...barOptions} />
          <ChartLegend legends={barLegends} />
        </ChartCard>
      </div>
    </div>
  );
};

export default TransactionDetails;
