import React, { useState } from "react";
import { Link } from "react-router-dom";

import ImageLight from "../assets/img/create-account-office.jpeg";
import ImageDark from "../assets/img/create-account-office-dark.jpeg";

import { Input, Label, Button, HelperText } from "@windmill/react-ui";
import { useGlobalContext } from "../context/GlobalContext";
import { auth, db } from "../utils/Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useDispatch } from "react-redux";
import { loginUser } from "../app/features/auth/authSlice";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

function CreateAccount() {
  const dispatch = useDispatch();

  // get data from context
  const { notification, setnotification, loading, setloading } =
    useGlobalContext();

  // firstName state
  const [firstName, setfirstName] = useState("");

  // userName state
  const [userName, setuserName] = useState("");

  // email state
  const [email, setemail] = useState("");

  // password state
  const [password, setpassword] = useState("");

  // password state
  const [cpassword, setcpassword] = useState("");

  function emailToNumber(email) {
    let numericValue = 0;

    for (let i = 0; i < email.length; i++) {
      numericValue += email.charCodeAt(i);
    }

    // Ensure the numeric value is within the range of 10 digits
    numericValue %= 1e10;

    // Pad the numeric value with leading zeros to make it 10 digits
    const paddedAccountNumber = numericValue.toString().padStart(10, "0");

    return paddedAccountNumber;
  }

  const checkAccountNumberExists = async (accountNumber) => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "Users"),
        where("accountNumber", "==", accountNumber)
      )
    );

    return !querySnapshot.empty;
  };

  const generateUniqueAccountNumber = async (email) => {
    let accountNumber = emailToNumber(email);

    while (await checkAccountNumberExists(accountNumber)) {
      // Regenerate the account number
      accountNumber = (accountNumber + 1) % 1e10;
    }

    return accountNumber;
  };

  // Card details states
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardExpiryDate, setCardExpiryDate] = useState("");

  // Function to generate a random card number
  const generateCardNumber = () => {
    let cardNum = "";
    for (let i = 0; i < 16; i++) {
      cardNum += Math.floor(Math.random() * 10);
      if (i > 0 && i % 4 === 3 && i !== 15) {
        cardNum += " "; // Add a space after every 4 digits
      }
    }
    return cardNum;
  };

  // Function to generate a unique card number
  const generateUniqueCardNumber = async () => {
    let newCardNumber = generateCardNumber();

    while (await checkCardNumberExists(newCardNumber)) {
      newCardNumber = generateCardNumber();
    }

    return newCardNumber;
  };

  // Function to check if card number exists in Firestore
  const checkCardNumberExists = async (cardNumber) => {
    const querySnapshot = await getDocs(
      query(collection(db, "Users"), where("card.cardNumber", "==", cardNumber))
    );

    return !querySnapshot.empty;
  };

  // Function to auto-generate CVV
  const generateCVV = () => {
    return Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
  };

  // Function to auto-generate card expiry date
  const generateExpiryDate = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const futureYear = currentYear + Math.floor(Math.random() * 5); // Generate expiry date within next 5 years
    const month = (Math.floor(Math.random() * 12) + 1)
      .toString()
      .padStart(2, "0");
    return `${month}/${futureYear}`;
  };

  // handle login
  const handleSignUp = async () => {
    if (password !== cpassword) {
      setnotification("Passwords do not match");
    } else if (email && password && cpassword && firstName && userName) {
      setloading(true);

      const trimmedfirstName = firstName.trim();
      const trimmeduserName = userName.trim().toLowerCase();
      const trimmedemail = email.trim();
      const trimmedpassword = password.trim();

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          trimmedemail,
          trimmedpassword
        );
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: `${trimmedfirstName}`,
        });

        const accountNumber = await generateUniqueAccountNumber(trimmedemail);

        // Generate and validate card details

        const newCardNumber = await generateUniqueCardNumber();
        const newCardCVV = generateCVV();
        const newCardExpiryDate = generateExpiryDate();

        await addDoc(collection(db, "Users"), {
          firstName: trimmedfirstName,
          userName: trimmeduserName,
          email: trimmedemail,
          userId: user.uid,
          accountNumber: accountNumber,
          createdAt: serverTimestamp(),
          accountBalance: 0,
          pin: "",
          transactions: [],
          card: [
            {
              cardHolderName: trimmedfirstName,
              cardNumber: newCardNumber,
              cvv: newCardCVV,
              cardExpiryDate: newCardExpiryDate,
            },
          ],
        });

        dispatch(loginUser(user.uid));

        setnotification("Account Created Successfully");
        window.location.href = "/login";
      } catch (error) {
        const errorMessage = error.message;
        console.error(error);
        setnotification(errorMessage);
      } finally {
        setloading(false);
      }
    } else {
      setnotification("All fields must be filled");
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>
              <Label>
                <span>Your Name</span>
                <Input
                  className="mt-1"
                  type="text"
                  value={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                  placeholder="Lauretta"
                />
              </Label>
              <Label className="mt-4">
                <span>User Name</span>
                <Input
                  className="mt-1"
                  type="text"
                  value={userName}
                  onChange={(e) => setuserName(e.target.value)}
                  placeholder="lauretta123"
                />
              </Label>
              <Label className="mt-4">
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="lauretta123@doe.com"
                />
              </Label>
              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  placeholder="***************"
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </Label>
              <Label className="mt-4">
                <span>Confirm password</span>
                <Input
                  className="mt-1"
                  placeholder="***************"
                  type="password"
                  value={cpassword}
                  onChange={(e) => setcpassword(e.target.value)}
                />
              </Label>

              <Label className="mt-6" check>
                <Input type="checkbox" />
                <span className="ml-2">
                  I agree to the{" "}
                  <span className="underline">privacy policy</span>
                </span>
              </Label>

              <Button
                onClick={handleSignUp}
                disabled={loading}
                block
                className="mt-4"
              >
                {loading ? <div class="lds-dual-ring"></div> : "Join Us"}
              </Button>

              <div className="py-3 h-5">
                <HelperText valid={false}>{notification}</HelperText>
              </div>

              <hr className="my-4" />

              {/* <Button block layout="outline">
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button block className="mt-4" layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button> */}

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/login"
                >
                  Already have an account? Login
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
