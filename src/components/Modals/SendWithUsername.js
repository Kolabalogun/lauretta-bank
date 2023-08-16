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

const SendWithUsername = ({
  showSendMoneyUserNameModal,
  handleCloseAddMoneyModal,
}) => {
  const { currentRegUser } = useGlobalContext();

  const [accountBalance, setAccountBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [transferPin, setTransferPin] = useState("");
  const [recipientData, setRecipientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const trimmedUsername = username.trim().toLowerCase();

    const checkForUsername = async () => {
      const usersRef = collection(db, "Users");
      const userNameQuery = await getDocs(
        query(usersRef, where("userName", "==", trimmedUsername))
      );

      if (!userNameQuery.empty) {
        const snapshot = await getDocs(
          query(usersRef, where("userName", "==", trimmedUsername))
        );
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipientData(data[0]);
        setNotification(recipientData?.firstName);
      }
    };

    checkForUsername();
  }, [username]);

  const handleSubmit = async () => {
    if (!username || !accountBalance || !transferPin) {
      setNotification("Please fill all details.");
      return;
    }

    if (!recipientData) {
      setNotification("Username not found.");
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
        username.length + accountBalance.toString().length + transferPin.length;
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

      setTimeout(() => {
        handleCloseAddMoneyModal();
        window.location.reload();
      }, 3000);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setNotification("An error occurred while processing your request.");
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={showSendMoneyUserNameModal}
      onClose={handleCloseAddMoneyModal}
    >
      <ModalHeader>Send Money</ModalHeader>
      <ModalBody>
        <div className="grid gap-4">
          <Label>
            <span>Enter your recipient Username</span>
            <Input
              className="mt-1"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g akinola103"
            />
          </Label>
          <Label>
            <span>Enter Amount you want to Transfer</span>
            <Input
              className="mt-1"
              name="accountBalance"
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
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
        <Button layout="outline" onClick={handleCloseAddMoneyModal}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? <div className="lds-dual-ring"></div> : "Transfer"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SendWithUsername;
