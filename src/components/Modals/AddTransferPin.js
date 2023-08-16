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

import { useGlobalContext } from "../../context/GlobalContext";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/Firebase";

const AddTransferPin = ({ showAddPinModal, handleCloseAddPinModal }) => {
  const { currentRegUser, setnotification, notification, setloading, loading } =
    useGlobalContext();

  const [transferPin, settransferPin] = useState("");
  const [ctransferPin, setctransferPin] = useState("");

  // Function to handle input change
  const handleInputChange = (e) => {
    settransferPin(e.target.value);
  };

  // handle Submit
  const handleSubmit = async () => {
    if (transferPin !== ctransferPin) {
      setnotification("Pin do not match!");
    } else if (transferPin) {
      setloading(true);
      try {
        const collectionRef = collection(db, "Users");
        const docRef = doc(collectionRef, currentRegUser?.id);
        await updateDoc(docRef, {
          ...currentRegUser,
          pin: transferPin,
        });
        setnotification("You've successfully added money to your account");
        handleCloseAddPinModal();
        window.location.reload();
        setloading(false);
      } catch (error) {
        console.log(error);
        setnotification(error);
      }
    } else {
      setnotification("You need to add a value");
    }
  };

  return (
    <Modal isOpen={showAddPinModal} onClose={handleCloseAddPinModal}>
      <ModalHeader>Add Pin</ModalHeader>
      <ModalBody>
        <div className="grid gap-4  ">
          <Label>
            <span>Enter your Transfer Pin</span>
            <Input
              className="mt-1"
              name="transferPin"
              type="password"
              maxLength={4}
              value={transferPin}
              onChange={handleInputChange}
              placeholder="e.g 3333"
            />
          </Label>
          <Label>
            <span>Confim your Transfer Pin</span>
            <Input
              className="mt-1"
              name="transferPin"
              type="password"
              maxLength={4}
              value={ctransferPin}
              onChange={(e) => setctransferPin(e.target.value)}
              placeholder="e.g 3333"
            />
          </Label>
        </div>
        <div className="py-3 h-5">
          <HelperText valid={true}>{notification}</HelperText>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button layout="outline" onClick={handleCloseAddPinModal}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={() => {
            handleSubmit();
          }}
        >
          {loading ? <div class="lds-dual-ring"></div> : "Save"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddTransferPin;
