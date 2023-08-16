import React, { useEffect, useState } from "react";

import InfoCard from "../components/Cards/InfoCard";
import {
  TableCell,
  TableRow,
  TableBody,
  TableHeader,
  Table,
  Pagination,
  TableFooter,
  TableContainer,
  Card,
  CardBody,
} from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import { FormsIcon, MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";
import SectionTitle from "../components/Typography/SectionTitle";
import CTA from "../components/CTA";
import { Button } from "@windmill/react-ui";
import { useGlobalContext } from "../context/GlobalContext";
import ThemedSuspense from "../components/ThemedSuspense";

import Addmoney from "../components/Modals/Addmoney";
import ManualDeposit from "../components/Modals/ManualDeposit";
import Transfer from "../components/Modals/Transfer";
import Username from "../components/Modals/Username";
import AddTransferPin from "../components/Modals/AddTransferPin";
import SelectCardModal from "../components/Modals/SelectCardModal";

function Dashboard() {
  const { currentRegUser, loading } = useGlobalContext();

  const [transactionArray, settransactionArray] = useState([]);

  useEffect(() => {
    if (currentRegUser) {
      settransactionArray(currentRegUser.transactions);
    }
  }, [currentRegUser]);

  function getFormattedDate() {
    const options = {
      weekday: "short", // Short weekday name (e.g., "Mon", "Tue", etc.)
      day: "numeric", // Numeric day of the month (e.g., 1, 2, etc.)
      month: "short", // Short month name (e.g., "Jan", "Feb", etc.)
      year: "numeric", // Full year (e.g., 2022)
      hour: "numeric", // Numeric hour (e.g., 1, 2, etc.)
      minute: "numeric", // Numeric minute (e.g., 30, 45, etc.)
      hour12: true, // Use 12-hour clock format (true) or 24-hour clock format (false)
    };

    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return formattedDate;
  }

  function formatDateToDisplay(dateString) {
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  const formattedDate = getFormattedDate();

  const [pageTable2, setPageTable2] = useState(1);

  const [dataTable2, setDataTable2] = useState([]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = transactionArray.length;

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataTable2(
      transactionArray?.slice(
        (pageTable2 - 1) * resultsPerPage,
        pageTable2 * resultsPerPage
      )
    );
  }, [pageTable2, currentRegUser, transactionArray]);

  // add money modal

  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);

  const handleOpenAddMoneyModal = () => {
    setShowAddMoneyModal(true);
  };

  const handleCloseAddMoneyModal = () => {
    setShowAddMoneyModal(false);
  };

  // direct deposit modal

  const [showDirectDepositModal, setShowDirectDepositModal] = useState(false);

  const handleOpenDirectDepositModal = () => {
    setShowDirectDepositModal(true);
  };

  const handleCloseDirectDepositModal = () => {
    setShowDirectDepositModal(false);
  };

  // direct transfer modal

  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleOpenTransferModal = () => {
    setShowTransferModal(true);
  };

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
  };

  // direct Username modal

  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const handleOpenUsernameModal = () => {
    setShowUsernameModal(true);
  };

  const handleCloseUsernameModal = () => {
    setShowUsernameModal(false);
  };
  // direct Username modal

  const [showCardModal, setShowCardModal] = useState(false);

  const handleOpenCardModal = () => {
    setShowCardModal(true);
  };

  const handleCloseCardModal = () => {
    setShowCardModal(false);
  };
  // add pin modal

  const [showAddPinModal, setShowAddPinModal] = useState(false);

  const handleOpenAddPinModal = () => {
    setShowAddPinModal(true);
  };

  const handleCloseAddPinModal = () => {
    setShowAddPinModal(false);
  };

  if (loading) {
    return <ThemedSuspense />;
  }

  return (
    <>
      {/* Modals  */}

      <Addmoney
        showAddMoneyModal={showAddMoneyModal}
        handleOpenDirectDepositModal={handleOpenDirectDepositModal}
        handleOpenUsernameModal={handleOpenUsernameModal}
        handleOpenTransferModal={handleOpenTransferModal}
        handleOpenCardModal={handleOpenCardModal}
        handleCloseAddMoneyModal={handleCloseAddMoneyModal}
      />

      <ManualDeposit
        showDirectDepositModal={showDirectDepositModal}
        handleCloseDirectDepositModal={handleCloseDirectDepositModal}
      />

      <Username
        showUsernameModal={showUsernameModal}
        handleCloseUsernameModal={handleCloseUsernameModal}
      />

      <Transfer
        showTransferModal={showTransferModal}
        handleCloseTransferModal={handleCloseTransferModal}
      />

      <SelectCardModal
        showCardModal={showCardModal}
        handleCloseCardModal={handleCloseCardModal}
      />

      <AddTransferPin
        showAddPinModal={showAddPinModal}
        handleCloseAddPinModal={handleCloseAddPinModal}
      />

      <div className="flex justify-between items-center">
        <PageTitle>Dashboard</PageTitle>

        <Button onClick={handleOpenAddMoneyModal}>Add Money</Button>
      </div>
      <CTA />

      {!currentRegUser?.pin && (
        <Card
          onClick={handleOpenAddPinModal}
          className="mb-8 shadow-md cursor-pointer"
        >
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You are yet to add your Transfer Pin. Click to add your Transfer
              Pin
            </p>
          </CardBody>
        </Card>
      )}
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-3 ">
        <InfoCard
          title="Account balance"
          value={`N ${
            currentRegUser ? parseInt(currentRegUser?.accountBalance) : 0
          }`}
        >
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>
        <InfoCard
          title="Total Transactions"
          value={currentRegUser ? transactionArray?.length : 0}
        >
          <RoundIcon
            icon={FormsIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>
        <InfoCard title="Today's Date" value={formattedDate}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
      <SectionTitle>Recent Transactions</SectionTitle>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Transaction</TableCell>
              <TableCell>Category</TableCell>

              <TableCell>Amount</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable2
              ?.map((transaction, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">
                          {" "}
                          {formatDateToDisplay(transaction?.date)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{transaction?.name}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">{transaction?.category}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{transaction?.type}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">
                      {transaction?.type === "Debit" && "-"}N
                      {parseInt(transaction?.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
              .reverse()}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default Dashboard;
