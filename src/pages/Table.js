import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Pagination,
  Input,
  CardBody,
  Card,
} from "@windmill/react-ui";
import { useGlobalContext } from "../context/GlobalContext";

function TransactionTables() {
  const { usersFromDB } = useGlobalContext();

  const users = usersFromDB;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  // Setup pages control for the table
  const [page, setPage] = useState(1);

  // Setup data for the table
  const [dataTable, setDataTable] = useState([]);

  // Pagination setup
  const resultsPerPage = 10;
  const totalResults = filteredUsers.length;

  // Pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // Search functionality
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(1); // Reset to the first page when search query changes
  }, [searchQuery, users]);

  // On page change or filtered users change, load new sliced data
  useEffect(() => {
    setDataTable(
      filteredUsers.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [page, filteredUsers]);

  return (
    <>
      <PageTitle>Transaction Tables</PageTitle>

      <Card className="mb-8 shadow-md">
        <CardBody>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This table shows the statistical data of File Size and Encrytion and
            Decrytion time taken for each transactions
          </p>
        </CardBody>
      </Card>
      <Input
        className="mb-4"
        placeholder="Search by user name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>S/N</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>File Size</TableCell>
              <TableCell>Time Taken</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable.map((user, i) => (
              <React.Fragment key={i}>
                {user?.transactions.map((transaction, j) => (
                  <TableRow key={j}>
                    <TableCell>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {j + 1}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold">{user?.firstName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(transaction?.date).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {transaction?.totalFileSize
                          ? transaction?.totalFileSize
                          : 0}{" "}
                        KB
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {transaction?.taketaken
                          ? transaction?.taketaken?.toFixed(2)
                          : 0}{" "}
                        s
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChange}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default TransactionTables;
