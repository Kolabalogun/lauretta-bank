import React, { useState } from "react";
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
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/Firebase";

const SelectCardModal = ({ showCardModal, handleCloseCardModal }) => {
  const { currentRegUser, setnotification, notification, setloading, loading } =
    useGlobalContext();

  const [selectedCard, setselectedCard] = useState(null);

  // Function to handle input change
  const handleSelectedCard = (card, i) => {
    if (i === 0) {
      return setnotification("You can't deposit money through our Bank Card");
    } else {
      setselectedCard(card);
    }
  };

  const [accountBalance, setAccountBalance] = useState(0);

  // Function to handle input change
  const handleInputChange = (e) => {
    setAccountBalance(parseInt(e.target.value));
  };

  // handle Submit
  const handleSubmit = async () => {
    if (!selectedCard || !accountBalance) {
      setnotification("Please fill all details.");
      return;
    }

    try {
      setloading(true);
      const collectionRef = collection(db, "Users");
      const docRef = doc(collectionRef, currentRegUser?.id);
      await updateDoc(docRef, {
        ...currentRegUser,
        transactions: [
          ...currentRegUser.transactions,
          {
            category: "Card Deposit",
            name: selectedCard?.cardHolderName,
            amount: accountBalance,
            date: new Date().toISOString(),
            type: "Credit",
          },
        ],
        accountBalance:
          currentRegUser?.accountBalance + parseInt(accountBalance),
      });
      setnotification("You've successfully added money to your account");

      setTimeout(() => {
        handleCloseCardModal();
        window.location.reload();
      }, 2000);

      setloading(false);
    } catch (error) {
      console.log(error);
      setnotification("An error occurred while processing your request.");
      setloading(false);
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
          ) : (
            <>
              {currentRegUser?.card.length === 0 ? (
                <p>You're yet to add a Card</p>
              ) : (
                <div className="grid gap-4  ">
                  {currentRegUser?.card.map((card, i) => (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleSelectedCard(card, i)}
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

export default SelectCardModal;
