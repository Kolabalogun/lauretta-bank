import React, { useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Button } from "@windmill/react-ui";
import { NavLink } from "react-router-dom";
import { Input, HelperText, Label, Select, Textarea } from "@windmill/react-ui";
import { useGlobalContext } from "../context/GlobalContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../utils/Firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { fetchFirestoreData } from "../Hook/fetchFirestoreData";

const CreateProject = () => {
  // get data from context
  const { notification, setnotification, loading, setloading } =
    useGlobalContext();

  const { id } = useParams();

  // form  initial state
  const initialState = {
    projectName: "",
    projectLink: "",
    imgUrl: "",
    projectdescription: "",
  };

  // form state
  const [form, setform] = useState(initialState);

  // get document info if ID is present
  useEffect(() => {
    const getPageContentDetail = async () => {
      setloading(true);
      const data = await fetchFirestoreData("Projects", id);
      if (data) {
        setform(data);
      }
      setloading(false);
    };

    getPageContentDetail();
  }, [id, setloading]);

  // file upload state
  const [file, setfile] = useState(null);

  // file upload progress state
  const [progress, setprogress] = useState(null);

  const [dateId, setdateId] = useState("");

  // to set timeId
  useEffect(() => {
    const dateId = new Date().getTime();
    setdateId(dateId);
  }, []);

  const { projectName, imgUrl, projectdescription, projectLink } = form;

  // file upload
  useEffect(() => {
    const uploadFile = () => {
      setloading(true);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.ceil(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setnotification("Upload is " + progress + "% done");

          setprogress(progress);
          switch (snapshot.state) {
            case "paused":
              setnotification("Upload is paused");
              break;
            case "running":
              // setnotification("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.error(error);
          setnotification(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setnotification("Image Uploaded");
            setform((prev) => ({ ...prev, imgUrl: downloadUrl }));
          });
        }
      );
      setloading(false);
    };

    file && uploadFile();
  }, [file]);

  // handle change text
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async () => {
    if (projectName && imgUrl && projectdescription && projectLink) {
      setloading(true);

      try {
        await addDoc(collection(db, "Projects"), {
          ...form,
          dateId,
          createdAt: serverTimestamp(),
        });
        setnotification("Project Successfully Added");
        setform(initialState);
        setloading(false);
      } catch (error) {
        console.log(error);
        setnotification(error);
        setloading(false);
      }
    } else {
      return setnotification("All fields must be filled");
    }
  };

  // handle submit
  const handleUpdate = async () => {
    if (projectName && imgUrl && projectdescription && projectLink) {
      setloading(true);

      try {
        // Update the document in Firestore
        const collectionRef = collection(db, "Projects");
        const docRef = doc(collectionRef, id);
        await updateDoc(docRef, {
          ...form,
          updatedAt: serverTimestamp(),
        });

        setnotification("Project Successfully Updated");

        setloading(false);
      } catch (error) {
        console.log(error);
        setnotification(error);
        setloading(false);
      }
    } else {
      setnotification("All fields must be filled");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle>{id ? "Edit Project" : "Create Project"}</PageTitle>

        <NavLink to="/app/projects">
          <Button>See Projects</Button>
        </NavLink>
      </div>

      <div className="px-4 py-8 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <Label>
          <span>Project Name</span>
          <Input
            className="mt-1"
            name="projectName"
            value={projectName}
            onChange={handleChange}
            placeholder="Barbie - The Movie"
          />
        </Label>

        <Label className="mt-5">
          <span>Short Message</span>
          <Textarea
            className="mt-1"
            rows="3"
            name="projectdescription"
            value={projectdescription}
            onChange={handleChange}
            placeholder="Enter some  content."
          />
        </Label>

        <Label className="mt-5">
          <span>Project Link</span>
          <Input
            className="mt-1"
            name="projectLink"
            value={projectLink}
            onChange={handleChange}
            placeholder="https://www.youtube.com"
          />
        </Label>

        <div className="flex flex-col  mt-5">
          {imgUrl && (
            <div className=" mb-5 rounded-lg">
              <img
                className="rounded-lg object-cover   h-64"
                src={imgUrl}
                alt="cover"
              />
            </div>
          )}

          <Label className="">
            <span>Cover Image</span>
            <Input
              type="file"
              name="file"
              onChange={(e) => setfile(e.target.files[0])}
              className="mt-1"
            />
          </Label>
        </div>

        <div className="mt-5">
          <Button
            disabled={loading || (!id && progress !== 100)}
            onClick={id ? handleUpdate : handleSubmit}
          >
            {loading ? <div class="lds-dual-ring"></div> : "Submit"}
          </Button>
        </div>
        <div className="py-3 h-5">
          <HelperText valid={false}>{notification}</HelperText>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
