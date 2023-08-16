import { signOut } from "firebase/auth";
import React, { useState, createContext, useContext, useEffect } from "react";
import { auth, db } from "../utils/Firebase";
import useFirestoreCollection, {
  fetchFirestoreDataQuery,
} from "../Hook/useFirestoreCollection";
import { deleteDoc, doc } from "firebase/firestore";
import { fetchFirestoreData } from "../Hook/fetchFirestoreData";
import { useDispatch } from "react-redux";
import { loginUser, setAdmin } from "../app/features/auth/authSlice";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);

  // firebase check if user is signed in
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        dispatch(loginUser(authUser.uid));

        localStorage.setItem("userId", authUser.uid);
        localStorage.setItem("firstName", authUser.displayName);
      } else {
        setUser(null);
        dispatch(loginUser(null));

        localStorage.setItem("userId", null);
        localStorage.setItem("firstName", null);
      }
    });
  }, [dispatch]);

  // get current signed in info from registered voters
  const [currentRegUser, currentRegUserF] = useState(null);

  useEffect(() => {
    const getcurrentRegUserDetail = async () => {
      setloading(true);
      const data = await fetchFirestoreDataQuery("Users", user);
      if (data && data.length > 0) {
        currentRegUserF(data[0]);
      }
      setloading(false);
    };

    getcurrentRegUserDetail();
  }, [user]);

  useEffect(() => {
    if (currentRegUser?.isAdmin) {
      dispatch(setAdmin(currentRegUser?.isAdmin));
    }
  }, [currentRegUser, dispatch]);
  //   logging out user
  const handleLogout = async () => {
    signOut(auth).then(() => {
      dispatch(loginUser(null));

      window.location.href = "/login";
    });
  };

  //loading state
  const [loading, setloading] = useState(false);

  //notification state
  const [notification, setnotification] = useState("");

  //  notification timeout
  useEffect(() => {
    const timeoutt = setTimeout(() => {
      setnotification("");
    }, 3000);

    return () => {
      clearInterval(timeoutt);
    };
  }, [notification]);

  // get projects from firestore

  const {
    data: usersFromDB,
    loader: usersFromDBLoader,
    transactions,
  } = useFirestoreCollection("Users");

  console.log(usersFromDB);

  // get projects from firestore

  const { data: adminsFromDB, loader: adminsFromDBLoader } =
    useFirestoreCollection("Admin Users");

  // get page contents
  const [pageContent, pageContentF] = useState(null);

  useEffect(() => {
    const getPageContentDetail = async () => {
      setloading(true);
      const data = await fetchFirestoreData(
        "Page content",
        "5TpYbWjWzBZXUJmKpN32"
      );
      if (data) {
        pageContentF(data);
      }
      setloading(false);
    };

    getPageContentDetail();
  }, []);

  // general function to delete documents
  const deleteDocument = async (collectionName, id) => {
    try {
      setloading(true);
      await deleteDoc(doc(db, collectionName, id));
      alert("Deleted Successfully");
      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // delete projects
  const handleDeleteProject = async (id) => {
    await deleteDocument("Projects", id);
  };

  console.log(currentRegUser);

  return (
    <AppContext.Provider
      value={{
        handleLogout,
        currentRegUser,
        transactions,

        loading,
        setloading,
        notification,
        setnotification,
        usersFromDB,
        usersFromDBLoader,
        pageContent,
        handleDeleteProject,
        adminsFromDBLoader,
        adminsFromDB,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
