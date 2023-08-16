import React from "react";
import PageTitle from "../components/Typography/PageTitle";
import { useState } from "react";
import { useEffect } from "react";

import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Label,
  Input,
  HelperText,
} from "@windmill/react-ui";

import { useGlobalContext } from "../context/GlobalContext";
import ThemedSuspense from "../components/ThemedSuspense";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";
import TransactionDetails from "../components/Transaction/TransactionDetails";

const Transactions = () => {
  const { usersFromDBLoader, transactions, setnotification, notification } =
    useGlobalContext();

  const [pageTable2, setPageTable2] = useState(1);

  const [dataTable2, setDataTable2] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  // pagination setup
  const resultsPerPage = 18;
  const totalResults = transactions?.length;

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataTable2(
      transactions?.slice(
        (pageTable2 - 1) * resultsPerPage,
        pageTable2 * resultsPerPage
      )
    );
  }, [pageTable2, transactions]);

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

  // Filter data based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If the search query is empty, show default data based on pagination
      setDataTable2(
        transactions?.slice(
          (pageTable2 - 1) * resultsPerPage,
          pageTable2 * resultsPerPage
        )
      );
    } else {
      // Otherwise, filter the data based on the search query
      const filteredData = transactions?.filter(
        (c) =>
          c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setDataTable2(
        filteredData?.slice(
          (pageTable2 - 1) * resultsPerPage,
          pageTable2 * resultsPerPage
        )
      );
    }
  }, [searchQuery, pageTable2, transactions]);

  const [
    showTransactionVerificationModal,
    setShowTransactionVerificationModal,
  ] = useState(false);
  const [transactionToView, settransactionToView] = useState(null);

  const handleOpenVerifyRSAModal = (transaction) => {
    setShowTransactionVerificationModal(true);
    settransactionToView(transaction);
  };

  const handleCloseVerifyRSAModal = () => {
    setShowTransactionVerificationModal(false);
  };

  const [showTransDetails, setshowTransDetails] = useState(false);

  const [rsaKey, setrsaKey] = useState("");

  const handleVerifyRSA = () => {
    if (rsaKey === transactionToView?.rsaKey) {
      setnotification("RSA key matched! Transaction details:");

      setTimeout(() => {
        handleCloseVerifyRSAModal();
        setshowTransDetails(true);
      }, 1000);
    } else {
      setnotification("Key do not match");
    }
  };

  if (usersFromDBLoader) {
    return <ThemedSuspense />;
  }

  return (
    <div>
      {showTransDetails ? (
        <TransactionDetails
          transaction={transactionToView}
          setshowTransDetails={setshowTransDetails}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <PageTitle>Transactions</PageTitle>
          </div>

          <Label className="my-5">
            <span>Search</span>
            <Input
              className="mt-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by category, amount or name..."
            />
          </Label>

          <Modal
            isOpen={showTransactionVerificationModal}
            onClose={handleCloseVerifyRSAModal}
          >
            <ModalHeader>Verify Access</ModalHeader>
            <ModalBody>
              Enter the RSA private key to view this Transaction:
              <Label>
                <span>{transactionToView?.rsaKey}</span>
                <Input
                  className="mt-1"
                  name="accountBalance"
                  type="number"
                  value={rsaKey}
                  onChange={(e) => setrsaKey(e.target.value)}
                  placeholder="e.g **** **** ****"
                />
              </Label>
              <div className="py-3 h-5">
                <HelperText valid={false}>{notification}</HelperText>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button layout="outline" onClick={handleCloseVerifyRSAModal}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleVerifyRSA();
                }}
              >
                View
              </Button>
            </ModalFooter>
          </Modal>

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
                {dataTable2?.map((transaction, i) => (
                  <TableRow
                    key={i}
                    onClick={() => {
                      handleOpenVerifyRSAModal();
                      settransactionToView(transaction);
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">
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
                ))}
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
      )}
    </div>
  );
};

export default Transactions;
