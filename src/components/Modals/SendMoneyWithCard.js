import React, { useState, useEffect } from "react";
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
import { CardIcon, MoneyIcon } from "../../icons";
import { useGlobalContext } from "../../context/GlobalContext";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../utils/Firebase";
import { generateRSAKey } from "../../utils/demo/func";

const SendMoneyWithCard = ({ showCardModal, handleCloseCardModal }) => {
  const { currentRegUser, setnotification, notification, setloading, loading } =
    useGlobalContext();

  const [recipientData, setRecipientData] = useState(null);

  const [selectedCard, setselectedCard] = useState(null);

  const [accountBalance, setAccountBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [transferPin, settransferPin] = useState("");

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

  // Function to handle input change
  const handleInputChange = (e) => {
    setAccountBalance(parseInt(e.target.value));
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!accountNumber || !accountBalance || !transferPin) {
      setnotification("Please fill all details.");
      return;
    }

    if (accountNumber === currentRegUser?.accountNumber) {
      setnotification("Sorry you can't send money to yourself.");
      return;
    }

    if (!recipientData) {
      setnotification("Account number not found.");
      return;
    }

    if (transferPin !== currentRegUser?.pin) {
      setnotification("Incorrect Transfer Pin.");
      return;
    }

    if (accountBalance > currentRegUser?.accountBalance) {
      setnotification(
        "You don't have sufficient funds! Please fund your account."
      );
      return;
    }

    try {
      setloading(true);

      const totalInputSize =
        accountNumber.toString().length +
        accountBalance.toString().length +
        selectedCard.cardHolderName.toString().length +
        selectedCard.cardNumber.toString().length +
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
              category: "Transfer using Card",
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
              category: "Transfer using Card",
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

        setnotification("Transfer Successful");
      } else {
        setnotification("Transfer Failed");
      }

      // Close modal and reload after a delay
      setTimeout(() => {
        handleCloseCardModal();
        window.location.reload();
      }, 3000);

      setloading(false);
    } catch (error) {
      console.error(error);
      setnotification("An error occurred while processing your request.");
    }
  };

  return (
    <Modal
      isOpen={showCardModal}
      onClose={() => {
        setselectedCard(null);
        handleCloseCardModal();
      }}
    >
      <ModalHeader>Select Card</ModalHeader>
      <ModalBody>
        <>
          {selectedCard ? (
            <div className="grid gap-4  ">
              <InfoCard
                title={selectedCard?.cardNumber}
                value={selectedCard?.cardHolderName}
              >
                <RoundIcon
                  icon={CardIcon}
                  iconColorClass="text-green-500 dark:text-green-100"
                  bgColorClass="bg-green-100 dark:bg-green-500"
                  className="mr-4"
                />
              </InfoCard>
              <InfoCard
                title="Enter the amount to Transfer"
                value={accountBalance}
              >
                <RoundIcon
                  icon={MoneyIcon}
                  iconColorClass="text-green-500 dark:text-green-100"
                  bgColorClass="bg-green-100 dark:bg-green-500"
                  className="mr-4"
                />
              </InfoCard>

              <Label>
                <span>Recipient Account Number</span>
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
              <Label>
                <span>Enter your Transfer Pin</span>
                <Input
                  className="mt-1"
                  name="transferPin"
                  type="password"
                  maxLength={4}
                  value={transferPin}
                  onChange={(e) => settransferPin(e.target.value)}
                  placeholder="e.g 3333"
                />
              </Label>
            </div>
          ) : (
            <>
              {currentRegUser?.card.length === 0 ? (
                <p>You're yet to add a Card</p>
              ) : (
                <div className="grid gap-4  ">
                  {currentRegUser?.card.map((card, i) => (
                    <div
                      className="cursor-pointer"
                      onClick={() => setselectedCard(card)}
                    >
                      <InfoCard
                        key={i}
                        title={card?.cardNumber}
                        value={card?.cardHolderName}
                      >
                        <RoundIcon
                          icon={CardIcon}
                          iconColorClass="text-green-500 dark:text-green-100"
                          bgColorClass="bg-green-100 dark:bg-green-500"
                          className="mr-4"
                        />
                      </InfoCard>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
        <div className="py-3 h-5">
          <HelperText valid={true}>{notification}</HelperText>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          layout="outline"
          onClick={() => {
            setselectedCard(null);
            handleCloseCardModal();
          }}
        >
          Cancel
        </Button>
        {selectedCard && (
          <Button onClick={handleSubmit}>
            {loading ? <div className="lds-dual-ring"></div> : "Save"}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default SendMoneyWithCard;
