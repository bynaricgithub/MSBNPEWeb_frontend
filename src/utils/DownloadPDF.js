import axios from "axios";
import { show } from "./Helper"; // Assuming show is a utility for showing notifications

export const downloadPDF = async (link, setDownloading) => {
  const name = link.split("/").pop();
  try {
    setDownloading((prev) => [...prev, link]);
    const res = await axios.get(link, { responseType: "blob" });
    const pdfBlob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", name);
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
    setDownloading((prev) => prev.filter((item) => item !== link));
  } catch (error) {
    setDownloading((prev) => prev.filter((item) => item !== link));
    show({ message: error.message, displayClass: "failure" });
  }
};
