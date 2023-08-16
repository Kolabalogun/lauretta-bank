import React from "react";
import {
  ModalBody,
  ModalHeader,
  Modal,
  Button,
  ModalFooter,
  Label,
} from "@windmill/react-ui";
import { useGlobalContext } from "../../context/GlobalContext";

const Username = ({ showUsernameModal, handleCloseUsernameModal }) => {
  const { currentRegUser } = useGlobalContext();
  return (
    <Modal isOpen={showUsernameModal} onClose={handleCloseUsernameModal}>
      <ModalHeader>Hi @{currentRegUser?.userName}</ModalHeader>

      <ModalBody>
        <Label className="mb-3">
          Share your username with your Friends. Use it to send money to each
          other.
        </Label>
      </ModalBody>

      <ModalFooter>
        <Button onClick={handleCloseUsernameModal}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default Username;
