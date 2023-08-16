import React, { useEffect, useState } from "react";

import PageTitle from "../components/Typography/PageTitle";

import { Button, CardBody, Card } from "@windmill/react-ui";
import CardDetailsModal from "../components/Modals/CardDetails";
import { useGlobalContext } from "../context/GlobalContext";

const CardPage = () => {
  const { currentRegUser } = useGlobalContext();

  const [cardArray, setcardArray] = useState([]);

  useEffect(() => {
    setcardArray(currentRegUser?.card);
  }, [currentRegUser]);

  // add card modal

  const [showModal, setShowModal] = useState(false);
  const [cardID, setcardID] = useState(null);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="">
      <CardDetailsModal
        isOpen={showModal}
        onClose={handleCloseModal}
        cardID={cardID}
        setcardID={setcardID}
      />

      <div className="flex justify-between items-center">
        <PageTitle>Card</PageTitle>

        <Button onClick={handleOpenModal}>Add Card</Button>
      </div>
      {/* <CTA />  */}
      {currentRegUser?.card.length === 0 && (
        <div className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span>{`You're yet to add your Card. Click the 'Add Card' about to add a Card`}</span>
          </div>
        </div>
      )}
      {/* <CTA />  */}
      <div className="grid gap-4 md:grid-cols-2 ">
        {cardArray?.map((card, i) => (
          <div
            onClick={() => {
              setcardID(card);
              handleOpenModal();
            }}
            key={i}
            className="cursor-pointer"
          >
            <Card>
              <CardBody>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
                  {card?.cardHolderName}
                </p>

                <ul>
                  <li>
                    <p className="text-gray-600 dark:text-gray-400 mt-1  ">
                      Card Number
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      {card?.cardNumber}
                    </p>
                  </li>
                  <li>
                    <p className="text-gray-600 dark:text-gray-400 mt-1  ">
                      Card Expiry Date
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs ">
                      {card?.cardExpiryDate}
                    </p>
                  </li>
                  <li>
                    <p className="text-gray-600 dark:text-gray-400 mt-1  ">
                      Card CVV
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
                      {card?.cvv}
                    </p>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardPage;
