import React, { useState, useEffect } from "react";

import { Input, Label, Button, HelperText } from "@windmill/react-ui";
import { useGlobalContext } from "../context/GlobalContext";
import { auth, db } from "../utils/Firebase";
import { updateProfile } from "firebase/auth";
import { collection, doc, updateDoc } from "firebase/firestore";

function Settings() {
  // get data from context
  const { notification, setnotification, loading, setloading, currentRegUser } =
    useGlobalContext();

  const [form, setform] = useState({
    firstName: "",
    email: "",
    pin: "",
    userName: "",
    accountNumber: "",
  });

  const { firstName, email, pin, userName, accountNumber } = form;

  useEffect(() => {
    if (currentRegUser) {
      setform(currentRegUser);
    }
  }, [currentRegUser]);

  // handle login
  const handleSignUp = async () => {
    if (pin && firstName && userName) {
      setloading(true);

      const trimmedfirstName = firstName.trim();
      const trimmeduserName = userName.trim();

      const trimmedpin = pin.trim();

      try {
        const collectionRef = collection(db, "Users");
        const docRef = doc(collectionRef, currentRegUser?.id);
        await updateDoc(docRef, {
          ...currentRegUser,
          firstName: trimmedfirstName,
          userName: trimmeduserName,
        });
        setnotification("Profile Successfully Updated");
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
    <div className="flex items-center h-[80vh] p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1  justify-center items-center max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col ">
          <main className="flex items-center justify-center p-6 sm:p-12 ">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Your Profile
              </h1>
              <Label>
                <span>Your Name</span>
                <Input
                  className="mt-1"
                  type="text"
                  value={firstName}
                  onChange={(e) =>
                    setform({
                      ...form,
                      firstName: e.target.value,
                    })
                  }
                  placeholder=""
                />
              </Label>

              <Label className="mt-4">
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  readOnly
                  value={email}
                  placeholder="lauretta123@gmail.com"
                />
              </Label>
              <Label className="mt-4">
                <span>Account Number</span>
                <Input
                  className="mt-1"
                  type="number"
                  readOnly
                  value={accountNumber}
                  placeholder="0000001234"
                />
              </Label>
              <Label className="mt-4">
                <span>Username</span>
                <Input
                  className="mt-1"
                  value={userName}
                  onChange={(e) =>
                    setform({
                      ...form,
                      userName: e.target.value,
                    })
                  }
                  placeholder="lauretta123"
                />
              </Label>
              {/* <Label className="mt-4">
                <span>Transfer Pin</span>
                <Input
                  className="mt-1"
                  placeholder="****"
                  type="pin"
                  value={pin}
                  maxLength={4}
                  onChange={(e) =>
                    setform({
                      ...form,
                      pin: e.target.value,
                    })
                  }
                />
              </Label> */}

              <Button
                onClick={handleSignUp}
                disabled={loading}
                block
                className="mt-8"
              >
                {loading ? <div class="lds-dual-ring"></div> : "Update Profile"}
              </Button>

              <div className="py-3 h-5">
                <HelperText valid={true}>{notification}</HelperText>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Settings;
