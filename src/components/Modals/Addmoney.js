import React, { useState } from "react";
import {
  ModalBody,
  ModalHeader,
  Modal,
  Button,
  ModalFooter,
} from "@windmill/react-ui";
import InfoCard from "../Cards/InfoCard";
import RoundIcon from "../RoundIcon";
import { AtIcon, CardIcon, MoneyIcon, PaperIcon } from "../../icons";

const Addmoney = ({
  showAddMoneyModal,
  handleCloseAddMoneyModal,
  handleOpenTransferModal,
  handleOpenUsernameModal,
  handleOpenDirectDepositModal,
  handleOpenCardModal,
}) => {
  return (
    <Modal isOpen={showAddMoneyModal} onClose={handleCloseAddMoneyModal}>
      <ModalHeader>Add Money</ModalHeader>
      <ModalBody>
        <div className="grid gap-4  ">
          <div
            onClick={() => {
              handleCloseAddMoneyModal();
              handleOpenDirectDepositModal();
            }}
            className="cursor-pointer"
          >
            <InfoCard
              title="Deposit Cash through this dashboard"
              value="Direct Deposit"
            >
              <RoundIcon
                icon={MoneyIcon}
                iconColorClass="text-green-500 dark:text-green-100"
                bgColorClass="bg-green-100 dark:bg-green-500"
                className="mr-4"
              />
            </InfoCard>
          </div>
          <div
            onClick={() => {
              handleCloseAddMoneyModal();
              handleOpenUsernameModal();
            }}
            className="cursor-pointer"
          >
            <InfoCard
              title="Receive money using your username"
              value="Share your username"
            >
              <RoundIcon
                icon={AtIcon}
                iconColorClass="text-orange-500 dark:text-orange-100"
                bgColorClass="bg-orange-100 dark:bg-orange-500"
                className="mr-4"
              />
            </InfoCard>
          </div>
          <div
            onClick={() => {
              handleCloseAddMoneyModal();
              handleOpenTransferModal();
            }}
            className="cursor-pointer"
          >
            <InfoCard title="From bank app or internet" value="Bank Transfer">
              <RoundIcon
                icon={PaperIcon}
                iconColorClass="text-blue-500 dark:text-blue-100"
                bgColorClass="bg-blue-100 dark:bg-blue-500"
                className="mr-4"
              />
            </InfoCard>
          </div>
          <div
            onClick={() => {
              handleCloseAddMoneyModal();
              handleOpenCardModal();
            }}
            className="cursor-pointer"
          >
            <InfoCard title="Add money with debit card" value="Card">
              <RoundIcon
                icon={CardIcon}
                iconColorClass="text-teal-500 dark:text-teal-100"
                bgColorClass="bg-teal-100 dark:bg-teal-500"
                className="mr-4"
              />
            </InfoCard>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button onClick={handleCloseAddMoneyModal}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default Addmoney;
