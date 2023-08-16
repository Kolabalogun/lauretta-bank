import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  HelperText,
} from "@windmill/react-ui";
import { useGlobalContext } from "../../context/GlobalContext";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/Firebase";

function CardDetailsModal({ isOpen, onClose, cardID, setcardID }) {
  const { currentRegUser, setnotification, setloading, loading, notification } =
    useGlobalContext();

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardExpiryDate, setCardExpiryDate] = useState("");
  const [cvv, setCVV] = useState("");

  useEffect(() => {
    if (cardID) {
      setCardNumber(cardID?.cardNumber);
      setCardHolderName(cardID?.cardHolderName);
      setCardExpiryDate(cardID?.cardExpiryDate);
      setCVV(cardID?.cvv);
    }
  }, [cardID]);

  const handleSave = async () => {
    if (
      !validateCardNumber(cardNumber) ||
      !validateCardHolderName(cardHolderName) ||
      !cardExpiryDate ||
      !validateCVV(cvv)
    ) {
      return setnotification("Please fill all details");
    }
    setloading(true);
    try {
      const collectionRef = collection(db, "Users");
      const docRef = doc(collectionRef, currentRegUser?.id);
      await updateDoc(docRef, {
        ...currentRegUser,
        card: [
          ...currentRegUser.card,
          {
            cardNumber,
            cardHolderName,
            cardExpiryDate,
            cvv,
          },
        ],
      });

      setnotification("You've successfully added a Card");

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);

      setloading(false);
    } catch (error) {
      console.log(error);
      setnotification(error);
      setloading(false);
    }
  };

  const validateCardNumber = (number) => {
    // Validate card number format and length
    const regex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    return regex.test(number);
  };

  const validateCardHolderName = (name) => {
    // Validate card holder name is not empty
    return name.trim() !== "";
  };

  const validateCVV = (cvv) => {
    // CVV validation logic here (3-digit or 4-digit)
    const regex = /^[0-9]{3,4}$/;
    return regex.test(cvv);
  };

  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digits
    const groups = input.match(/\d{1,4}/g) || []; // Split into groups of 4 digits

    setCardNumber(groups.join("-").slice(0, 19)); // Limit to 16 digits
  };

  const handleCardExpiryDateChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digits
    const month = input.slice(0, 2);
    const year = input.slice(2, 6);

    setCardExpiryDate(`${month}/${year}`.slice(0, 7)); // Limit to MM/YYYY format
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setcardID(null);
        setCardNumber("");
        setCardHolderName("");
        setCardExpiryDate("");
        setCVV("");
      }}
    >
      <ModalHeader>
        {cardID ? cardID?.cardHolderName : "Enter Card Details"}
      </ModalHeader>
      <ModalBody>
        <Label className="mb-3">
          <span>Card Number (Format: xxxx-xxxx-xxxx-xxxx)</span>
          <Input
            readOnly={cardID ? true : false}
            className="mt-1"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
          />
        </Label>
        <Label className="mb-3">
          <span>Card Holder Name</span>
          <Input
            readOnly={cardID ? true : false}
            className="mt-1"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
          />
        </Label>
        <Label className="mb-3">
          <span>Card Expiry Date (MM/YYYY)</span>
          <Input
            readOnly={cardID ? true : false}
            className="mt-1"
            value={cardExpiryDate}
            onChange={handleCardExpiryDateChange}
            maxLength={7}
          />
        </Label>
        <Label className="mb-3">
          <span>CVV (3 or 4 digits)</span>
          <Input
            readOnly={cardID ? true : false}
            className="mt-1"
            value={cvv}
            onChange={(e) => setCVV(e.target.value)}
            maxLength={4}
          />
        </Label>
        <div className="py-3 h-5">
          <HelperText valid={true}>{notification}</HelperText>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          layout="outline"
          onClick={() => {
            onClose();
            setcardID(null);
            setCardNumber("");
            setCardHolderName("");
            setCardExpiryDate("");
            setCVV("");
          }}
        >
          Cancel
        </Button>

        {!cardID && (
          <Button
            disabled={loading}
            onClick={() => {
              handleSave();
            }}
          >
            {loading ? <div class="lds-dual-ring"></div> : "Save"}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}

export default CardDetailsModal;
