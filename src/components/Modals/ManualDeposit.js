import React, { useEffect, useState } from "react";
import {
  ModalBody,
  ModalHeader,
  Modal,
  Button,
  ModalFooter,
  Input,
  Label,
  HelperText,
} from "@windmill/react-ui";
import InfoCard from "../Cards/InfoCard";
import RoundIcon from "../RoundIcon";
import { AtIcon, CardIcon, MoneyIcon, PaperIcon } from "../../icons";
import { useGlobalContext } from "../../context/GlobalContext";
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/Firebase";
import { generateRSAKey } from "../../utils/demo/func";

const ManualDeposit = ({
  showDirectDepositModal,
  handleCloseDirectDepositModal,
}) => {
  const { currentRegUser, setnotification, notification, setloading, loading } =
    useGlobalContext();

  const [accountBalance, setAccountBalance] = useState(0);

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

  const formattedDate = getFormattedDate();

  // Function to handle input change
  const handleInputChange = (e) => {
    setAccountBalance(parseInt(e.target.value));
  };

  // handle Submit
  const handleSubmit = async () => {
    if (accountBalance) {
      setloading(true);

      const totalInputSize = accountBalance.toString().length;
      const totalFileSizeInBytes = totalInputSize * 2;
      const rsaKey = generateRSAKey();

      // Calculate the time taken based on file size
      const scaleFactor = 0.05; // Adjust this value to control the scaling effect
      const scaledTimeInSeconds = totalFileSizeInBytes * scaleFactor;

      // Apply a minimum and maximum limit to the scaled time
      const minTimeInSeconds = 0.1;
      const maxTimeInSeconds = 5.0;
      const timeTakenInSeconds = Math.min(
        maxTimeInSeconds,
        Math.max(minTimeInSeconds, scaledTimeInSeconds)
      );

      try {
        const collectionRef = collection(db, "Users");
        const docRef = doc(collectionRef, currentRegUser?.id);
        await updateDoc(docRef, {
          ...currentRegUser,
          transactions: [
            ...currentRegUser.transactions,
            {
              category: "Direct Deposit",
              name: currentRegUser?.firstName,
              amount: accountBalance,
              date: formattedDate,
              type: "Credit",
              rsaKey: rsaKey,
              taketaken: timeTakenInSeconds,
              totalFileSize: totalFileSizeInBytes,
            },
          ],
          accountBalance:
            currentRegUser?.accountBalance + parseInt(accountBalance),
        });
        setnotification("You've successfully added money to your account");

        setTimeout(() => {
          handleCloseDirectDepositModal();
          window.location.reload();
        }, 2000);

        setloading(false);
      } catch (error) {
        console.log(error);
        setnotification(error);
        setloading(false);
      }
    } else {
      setnotification("You need to add a Value");
    }
  };

  return (
    <Modal
      isOpen={showDirectDepositModal}
      onClose={handleCloseDirectDepositModal}
    >
      <ModalHeader>Direct Deposit</ModalHeader>
      <ModalBody>
        <div className="grid gap-4  ">
          <InfoCard title="Money" value={accountBalance}>
            <RoundIcon
              icon={MoneyIcon}
              iconColorClass="text-green-500 dark:text-green-100"
              bgColorClass="bg-green-100 dark:bg-green-500"
              className="mr-4"
            />
          </InfoCard>

          <Label>
            <span>Enter your Deposit</span>
            <Input
              className="mt-1"
              name="accountBalance"
              value={accountBalance}
              type="number"
              onChange={handleInputChange}
              placeholder="Enter your Deposit"
            />
          </Label>
        </div>
        <div className="py-3 h-5">
          <HelperText valid={true}>{notification}</HelperText>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button layout="outline" onClick={handleCloseDirectDepositModal}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? <div class="lds-dual-ring"></div> : "Save"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ManualDeposit;
