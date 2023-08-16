import React from "react";
import {
  ModalBody,
  ModalHeader,
  Modal,
  Button,
  ModalFooter,
  Input,
  Label,
} from "@windmill/react-ui";
import { useGlobalContext } from "../../context/GlobalContext";

const Transfer = ({ showTransferModal, handleCloseTransferModal }) => {
  const { currentRegUser } = useGlobalContext();
  return (
    <Modal isOpen={showTransferModal} onClose={handleCloseTransferModal}>
      <ModalHeader>Transfer</ModalHeader>

      <ModalBody>
        <Label className="mb-3">
          Use the details below to send money to your Lauretta Account from any
          Lauretta Bank Web App
        </Label>

        <div className="grid gap-4  ">
          <Label>
            <span>Bank</span>
            <Input
              className="mt-1"
              name="bank"
              value="Lauretta Bank"
              readOnly
            />
          </Label>
          <Label>
            <span>Account Number</span>
            <Input
              className="mt-1"
              name="bank"
              value={currentRegUser?.accountNumber}
              readOnly
            />
          </Label>
          <Label>
            <span>Account Name</span>
            <Input
              className="mt-1"
              name="bank"
              value={currentRegUser?.firstName}
              readOnly
            />
          </Label>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button onClick={handleCloseTransferModal}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default Transfer;
