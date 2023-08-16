import React, { useState } from "react";
import InfoCard from "../components/Cards/InfoCard";
import RoundIcon from "../components/RoundIcon";
import { AtIcon, CardIcon, PaperIcon } from "../icons";
import PageTitle from "../components/Typography/PageTitle";
import SendWithUsername from "../components/Modals/SendWithUsername";
import SendWithBankTransfer from "../components/Modals/SendWithBankTransfer";
import SendMoneyWithCard from "../components/Modals/SendMoneyWithCard";

const Pay = () => {
  // semd money username modal

  const [showSendMoneyUserNameModal, setShowSendMoneyUserNameModal] =
    useState(false);

  const handleOpenAddMoneyModal = () => {
    setShowSendMoneyUserNameModal(true);
  };

  const handleCloseAddMoneyModal = () => {
    setShowSendMoneyUserNameModal(false);
  };
  // semd money accoinf number modal

  const [showSendMoneyAccountNumberModal, setshowSendMoneyAccountNumberModal] =
    useState(false);

  const handleOpenAccountNumberModal = () => {
    setshowSendMoneyAccountNumberModal(true);
  };

  const handleCloseAccountNumberModal = () => {
    setshowSendMoneyAccountNumberModal(false);
  };
  // semd money card modal

  const [showSendMoneyCardModal, setshowSendMoneyCardModal] = useState(false);

  const handleOpenCardModal = () => {
    setshowSendMoneyCardModal(true);
  };

  const handleCloseCardModal = () => {
    setshowSendMoneyCardModal(false);
  };

  return (
    <div className="">
      <SendWithUsername
        showSendMoneyUserNameModal={showSendMoneyUserNameModal}
        handleCloseAddMoneyModal={handleCloseAddMoneyModal}
      />
      <SendWithBankTransfer
        showSendMoneyAccountNumberModal={showSendMoneyAccountNumberModal}
        handleCloseAccountNumberModal={handleCloseAccountNumberModal}
      />
      <SendMoneyWithCard
        showCardModal={showSendMoneyCardModal}
        handleCloseCardModal={handleCloseCardModal}
      />
      <PageTitle>Send Money</PageTitle>
      <div className="grid gap-4  ">
        <div
          onClick={() => {
            handleOpenAddMoneyModal();
          }}
          className="cursor-pointer"
        >
          <InfoCard title="Send money using username" value="Username">
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
            handleOpenAccountNumberModal();
          }}
          className="cursor-pointer"
        >
          <InfoCard title="To bank app or internet" value="Bank Transfer">
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
            handleOpenCardModal();
          }}
          className="cursor-pointer"
        >
          <InfoCard title="Send Money using Card" value="Card">
            <RoundIcon
              icon={CardIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default Pay;
