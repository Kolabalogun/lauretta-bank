import React from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody } from "@windmill/react-ui";

const Help = () => {
  return (
    <div>
      <PageTitle>Help</PageTitle>

      <Card>
        <CardBody>
          <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
            Lauretta Banks
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            In our bank app, we've implemented an enhanced hybrid cryptography
            model based on AES and RSA algorithms. This state-of-the-art
            security system ensures your online banking experience is protected
            against data breaches and phishing scams. Our platform includes
            features like managing your finances, card services, and user
            profiles. As part of our commitment to your security, we recommend
            staying informed about security measures, collaborating with
            cybersecurity experts, and regularly updating your online banking
            systems.
            <br /> <br />
            Feel free to tailor these descriptions to match the design and
            functionality of your bank app's pages.
          </p>
        </CardBody>
      </Card>

      <div className="grid gap-6 mt-12 mb-8 md:grid-cols-2">
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Dashboard
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to our advanced online banking platform that prioritizes
              your security. With our enhanced hybrid cryptography model based
              on AES and RSA algorithms, your transactions are safeguarded
              against cyber threats. Experience seamless and secure banking with
              features like money management, card services, and user profiles,
              all designed to enhance your online banking experience.
            </p>
          </CardBody>
        </Card>

        <Card colored className="text-white bg-purple-600">
          <CardBody>
            <p className="mb-4 font-semibold">Pay</p>
            <p>
              Manage your finances effortlessly with our Spend Money feature.
              Whether you're making purchases or transferring funds, our
              enhanced hybrid cryptography ensures that your transactions are
              encrypted, providing an added layer of security. Enjoy the
              convenience of online banking while having peace of mind knowing
              your data is protected.
            </p>
          </CardBody>
        </Card>
      </div>
      <div className="grid gap-6  mb-8 md:grid-cols-2">
        <Card colored className="text-white bg-purple-600">
          <CardBody>
            <p className="mb-4 font-semibold">Settings</p>
            <p>
              Your online banking profile is your digital gateway to financial
              management. With our cutting-edge hybrid cryptography technology,
              your user information is encrypted using AES and RSA algorithms,
              ensuring your personal data remains confidential. Access and
              update your profile with confidence, knowing that your security is
              our priority.
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Card
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Your banking experience is now more secure than ever with our
              advanced Card services. Our enhanced hybrid cryptography model
              combines AES and RSA encryption to safeguard your card
              information. Whether you're checking your card details or making
              payments, your data is shielded from potential cyber threats,
              ensuring a worry-free banking experience.
            </p>
          </CardBody>
        </Card>
      </div>
      <div className="grid gap-6  mb-8 md:grid-cols-2">
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Budget
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Take control of your spending habits with our Budget page. Our
              enhanced hybrid cryptography, integrating AES and RSA algorithms,
              ensures that your budget plans and financial insights remain
              private and protected. Create budgets, monitor expenses, and plan
              for your financial goals, all within a secure environment designed
              to keep your data safe.
            </p>
          </CardBody>
        </Card>

        <Card colored className="text-white bg-purple-600">
          <CardBody>
            <p className="mb-4 font-semibold">Invest</p>
            <p>
              Your online banking profile is your digital gateway to financial
              management. With our cutting-edge hybrid cryptography technology,
              your user information is encrypted using AES and RSA algorithms,
              ensuring your personal data remains confidential. Access and
              update your profile with confidence, knowing that your security is
              our priority.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Help;
