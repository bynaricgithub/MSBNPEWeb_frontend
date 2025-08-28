/* eslint-disable array-callback-return */
import { toast } from "react-toastify";
import aes from "crypto-js/aes";
import encHex from "crypto-js/enc-hex";
import padZeroPadding from "crypto-js/pad-zeropadding";
import CryptoJS from "crypto-js";
import API from "../API";
import { setCurrentUser, unsetCurrentUser } from "../Store/AllReducers/userSlice";
import { navigate } from "../Store/AllReducers/navSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";

import * as Yup from "yup";

export const circularTypes = [
  { value: 1, label: "Circular" },
  { value: 2, label: "Notification" },
  { value: 3, label: "Tenders" },
  { value: 4, label: "Downloads" },

  { value: 5, label: "Notice Board" },
  { value: 6, label: "MNC News" },
  { value: 7, label: "Press Release" },
  { value: 8, label: "Useful Links" },

  { value: 9, label: "Guidelines" },
  { value: 10, label: "Recognize Institutes" },
  { value: 11, label: "Syllabus" },
  { value: 12, label: "Fee Structure" },
];
export const membersTypes = [
  { value: 1, label: "Members" },
  { value: 2, label: "Home Page" },
];
export const imageCategories = [
  { value: 1, label: "ISO & Awards" },
  { value: 2, label: "Events & Minisiters" },
  { value: 3, label: "Golden Jubilee" },
  { value: 4, label: "Fort Inaugration" },
];
export const videoCategories = [
  { value: 1, label: "Speeches" },
  { value: 2, label: "Events" },
  { value: 3, label: "Documentary" },
];

export const uploadFileInChunks = async (file, storagePath = "uploads", setProgress) => {
  if (!file) return;

  const chunkSize = 1024 * 512; // 0.5 MB per chunk
  const totalChunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;
  let timestamp = Date.now();

  while (currentChunk < totalChunks) {
    const start = currentChunk * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("chunk", currentChunk);
    formData.append("totalChunks", totalChunks);
    formData.append("filename", file.name);
    formData.append("timestamp", timestamp);
    formData.append("storagePath", storagePath);

    try {
      const res = await API.post("/upload-chunk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // eslint-disable-next-line no-loop-func
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            // setProgress((prev) => Math.min((currentChunk / totalChunks) * 100, 100));
          }
        },
      });
      if (res.data?.filePath) {
        return res.data?.filePath;
      }
    } catch (error) {
      console.error("Error uploading chunk", error);
      break;
    }

    currentChunk++;
  }

  console.log("File uploaded successfully!");
};

export async function handleFileUploadS3(file, storagePath) {
  return uploadFileInChunks(file, storagePath);
}

export const handleFileDeleteS3 = async (filename) => {};

export async function fileUploadS3CustomName(file, storagePath) {
  uploadFileInChunks(file, storagePath);
}

export function show({ message, displayClass }) {
  if (displayClass === "success") {
    toast.success(message);
  } else if (displayClass === "warning") {
    toast.warn(message);
  } else if (displayClass === "danger" || displayClass === "failure") {
    toast.error(message);
  } else {
    toast.info(message);
  }
}

export function en(data) {
  try {
    let text = data !== undefined && data !== null && data !== "" ? "" + data + "" : "";
    if (text === "") {
      return text;
    }

    let key = encHex.parse(process.env.REACT_APP_EN_ID1);
    let iv = encHex.parse(process.env.REACT_APP_EN_ID2);
    let en1 = aes.encrypt(text, key, { iv: iv, padding: padZeroPadding }).toString();

    return en1;
  } catch (e) {
    console.log("Encryption log :", e);
    return "";
  }
}

export function de(data) {
  try {
    let encrypted = data !== undefined && data !== null && data !== "" ? data : "";
    if (encrypted === "") {
      return encrypted;
    }

    let key = encHex.parse(process.env.REACT_APP_EN_ID1);
    let iv = encHex.parse(process.env.REACT_APP_EN_ID2);
    let de1 = aes.decrypt(encrypted, key, { iv: iv }).toString(CryptoJS.enc.Utf8);

    return de1;
  } catch (e) {
    return "";
  }
}

export const whoAmI = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const res = await API.get("/whoAmI");
    setLoading(false);
    if (res.data.status === "success") {
      dispatch(setCurrentUser(JSON.parse(res?.data?.data)));
    } else {
      dispatch(unsetCurrentUser());
      dispatch(navigate("/admin/login"));
    }
  } catch (error) {
    setLoading(false);
    dispatch(unsetCurrentUser());
    dispatch(navigate("/admin/login"));
    console.error("WhoAmI Err:", error);
  }
};

// ------------------------------------- return Formik form -----------------------------------------
export const getFormikForm = (initialValues, required, onSubmit) => {
  let validationSchema = () => {
    let obj = {};

    required.map((item) => {
      obj[item] = Yup.string().required(item + " is Required");
    });

    return Yup.object().shape(obj);
  };

  let formikInitialValues = {};
  initialValues.map((item) => {
    formikInitialValues[item.name] = "";
  });

  return (
    <Formik
      initialValues={formikInitialValues}
      enableReinitialize={true}
      onSubmit={(values) => {
        onSubmit(values);
      }}
      validationSchema={validationSchema()}
    >
      {({ values }) => (
        <Form>
          {initialValues.map((item, index) => (
            <div className="form-floating mb-3" key={index}>
              <Field
                id={"floating" + item.name}
                name={item.name}
                type="text"
                value={values[item.name]}
                className="form-control"
                placeholder={item.name}
              />
              <label htmlFor={"floating" + item.name}>{item.heading}</label>
              <ErrorMessage name={item.name}>{(msg) => <div className="alert alert-danger">{msg}</div>}</ErrorMessage>
            </div>
          ))}
          <div className="text-center">
            <button type="submit" className="btn btn-primary m-2">
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
