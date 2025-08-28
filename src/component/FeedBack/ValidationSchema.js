import * as Yup from "yup";

export const feedbackValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").max(100, "Name should be less than 100 characters"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  number: Yup.string()
    .required("Mobile number is required")
    .matches(/^\d{10}$/, "Mobile Number should be exactly 10 digits"),
  feedback: Yup.string().required("Feedback is required").max(2000, "Feedback should not exceed 2000 characters"),
});
