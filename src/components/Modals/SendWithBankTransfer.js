import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  Label,
  HelperText,
} from "@windmill/react-ui";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { useGlobalContext } from "../../context/GlobalContext";
import { db } from "../../utils/Firebase";
import { generateRSAKey } from "../../utils/demo/func";

const SendWithBankTransfer = ({
  showSendMoneyAccountNumberModal,
  handleCloseAccountNumberModal,
}) => {
  // Context and state management
  const { currentRegUser } = useGlobalContext();
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [transferPin, setTransferPin] = useState("");
  const [recipientData, setRecipientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Effect to check for account number and update recipientData
  useEffect(() => {
    const trimmedAccountNumber = accountNumber.trim().toLowerCase();

    const checkForAccountNumber = async () => {
      const usersRef = collection(db, "Users");
      const accountNumberQuery = await getDocs(
        query(usersRef, where("accountNumber", "==", trimmedAccountNumber))
      );

      if (!accountNumberQuery.empty) {
        const snapshot = await getDocs(
          query(usersRef, where("accountNumber", "==", trimmedAccountNumber))
        );
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipientData(data[0]);
      }
    };

    checkForAccountNumber();
  }, [accountNumber]);

  // Function to handle input change for account balance
  const handleInputChange = (e) => {
    setAccountBalance(parseInt(e.target.value));
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!accountNumber || !accountBalance || !transferPin) {
      setNotification("Please fill all details.");
      return;
    }

    if (!recipientData) {
      setNotification("Account number not found.");
      return;
    }

    if (accountNumber === currentRegUser?.accountNumber) {
      setNotification("Sorry you can't send money to yourself.");
      return;
    }

    if (transferPin !== currentRegUser?.pin) {
      setNotification("Incorrect Transfer Pin.");
      return;
    }

    if (accountBalance > currentRegUser?.accountBalance) {
      setNotification(
        "You don't have sufficient funds! Please fund your account."
      );
      return;
    }

    try {
      setLoading(true);

      const totalInputSize =
        accountNumber.toString().length +
        accountBalance.toString().length +
        transferPin.length;
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

      const collectionRef = collection(db, "Users");
      const senderRef = doc(collectionRef, currentRegUser.id);
      const recipientRef = doc(collectionRef, recipientData.id);

      if (senderRef && recipientRef) {
        //update sender account
        await updateDoc(senderRef, {
          ...currentRegUser,
          transactions: [
            ...currentRegUser.transactions,
            {
              category: "Transfer",
              type: "Debit",
              name: recipientData?.firstName,
              amount: accountBalance,
              date: new Date().toISOString(),
              rsaKey: rsaKey,
              taketaken: timeTakenInSeconds,
              totalFileSize: totalFileSizeInBytes,
            },
          ],
          accountBalance:
            currentRegUser?.accountBalance - parseInt(accountBalance),
        });
        //update receiver account
        await updateDoc(recipientRef, {
          ...recipientData,
          transactions: [
            ...recipientData.transactions,
            {
              category: "Transfer",
              type: "Credit",
              name: currentRegUser?.firstName,
              amount: accountBalance,
              date: new Date().toISOString(),
              rsaKey: rsaKey,
              taketaken: timeTakenInSeconds,
              totalFileSize: totalFileSizeInBytes,
            },
          ],
          accountBalance:
            recipientData?.accountBalance + parseInt(accountBalance),
        });

        setNotification("Transfer Successful");
      } else {
        setNotification("Transfer Failed");
      }

      // Close modal and reload after a delay
      setTimeout(() => {
        handleCloseAccountNumberModal();
        window.location.reload();
      }, 3000);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setNotification("An error occurred while processing your request.");
    }
  };

  return (
    <Modal
      isOpen={showSendMoneyAccountNumberModal}
      onClose={handleCloseAccountNumberModal}
    >
      <ModalHeader>Send Money</ModalHeader>
      <ModalBody>
        <div className="grid gap-4">
          <Label>
            <span>Account Number</span>
            <Input
              className="mt-1"
              name="accountNumber"
              type="number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="0000001234"
            />
          </Label>
          <Label>
            <span>Enter Amount you want to Transfer</span>
            <Input
              className="mt-1"
              name="accountBalance"
              type="number"
              value={accountBalance}
              onChange={handleInputChange}
              placeholder="e.g 5000"
            />
          </Label>
          <Label>
            <span>Enter your Transfer Pin</span>
            <Input
              className="mt-1"
              name="transferPin"
              type="password"
              maxLength={4}
              value={transferPin}
              onChange={(e) => setTransferPin(e.target.value)}
              placeholder="e.g 3333"
            />
          </Label>
        </div>
        <div className="py-3 h-5">
          <HelperText valid={true}>{notification}</HelperText>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button layout="outline" onClick={handleCloseAccountNumberModal}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? <div className="lds-dual-ring"></div> : "Transfer"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SendWithBankTransfer;
