import React, { useState, useEffect } from "react";

import { Input, Card } from "@windmill/react-ui";

import { useGlobalContext } from "../context/GlobalContext";
import BarChart from "../components/Transaction/BarChart";
import PageTitle from "../components/Typography/PageTitle";

const ChartsPage = () => {
  const { usersFromDB } = useGlobalContext();

  const users = usersFromDB;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  return (
    <div>
      <PageTitle>Transaction Charts</PageTitle>
      <div className="mb-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username..."
        />
      </div>
      <div className="grid gap-6 ">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-4">
            <BarChart
              transactions={user.transactions}
              userName={user.userName}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChartsPage;
