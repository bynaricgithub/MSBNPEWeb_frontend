import React, { useMemo, useRef, useState } from "react";
import { Image } from "react-bootstrap";
import ContentModal from "./ContentModal";

// simple in-memory cache to avoid re-checking the same file
const urlCache = new Map();

/** join and normalize base + path */
function joinUrl(base, path) {
  const pathStr = path != null ? String(path) : "";
  if (!base) return pathStr;
  let b = base.endsWith("/") ? base.slice(0, -1) : base;
  let p = pathStr.startsWith("/") ? pathStr : `/${pathStr}`;
  return `${b}${p}`;
}
/** quick content-type checker (tries to be cheap & CORS-tolerant) */
async function probeUrlForPdf(url) {
  try {
    // Try a tiny ranged GET (fast if server supports ranges),
    // fall back gracefully if not supported.
    const res = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      cache: "no-store",
    });
    // If opaque (no-cors), we can’t read headers—assume success.
    // Otherwise check content-type explicitly
    const ct = res.headers?.get?.("content-type") || "";
    if (res.ok && (ct.startsWith("application/pdf") || ct === "application/octet-stream")) return true;

    // Some servers ignore Range; still check type
    if (res.ok && ct.startsWith("application/pdf")) return true;

    return false;
  } catch {
    return false;
  }
}

const FileComponent = ({ file, fileTitle, fileType }) => {
  const primaryUrl = useMemo(() => joinUrl(process.env.REACT_APP_DATA_SERVER_PATH, file), [file]);
  const fallbackUrl = useMemo(() => joinUrl(process.env.REACT_APP_SERVER_PATH, file), [file]);

  const [imgSrc, setImgSrc] = useState(primaryUrl);
  const [modalUrl, setModalUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  const resolvingRef = useRef(false);

  const isImageType = ["image", "homeImage", "image2", "memberImage", "search", "homeGallery", "gallery", "slider"].includes(fileType);

  const isPdfType = ["pdf", "pdf2", "searchpdf"].includes(fileType);

  const openModal = async () => {
    if (!isPdfType) {
      // images open immediately with whichever URL they resolved to
      setModalUrl(imgSrc || primaryUrl);
      setShowModal(true);
      return;
    }

    // PDFs: resolve best URL only when needed (on click)
    const cacheKey = `pdf::${primaryUrl}||${fallbackUrl}`;
    if (urlCache.has(cacheKey)) {
      setModalUrl(urlCache.get(cacheKey));
      setShowModal(true);
      return;
    }

    if (resolvingRef.current) return; // guard double-clicks
    resolvingRef.current = true;

    // Try primary
    let finalUrl = primaryUrl;
    const okPrimary = await probeUrlForPdf(primaryUrl);

    if (!okPrimary) {
      const okFallback = await probeUrlForPdf(fallbackUrl);
      finalUrl = okFallback ? fallbackUrl : primaryUrl; // last resort: still show primary
    }

    urlCache.set(cacheKey, finalUrl);
    resolvingRef.current = false;
    setModalUrl(finalUrl);
    setShowModal(true);
  };

  return (
    <>
      {/* IMAGE TYPES → let the browser handle fallback via onError */}
      {isImageType && (
        <Image
          as={fileType === "image" || fileType === "homeImage" ? "img" : Image}
          src={imgSrc}
          alt={fileTitle}
          onError={() => setImgSrc(fallbackUrl)}
          onClick={openModal}
          className={
            fileType === "homeImage"
              ? "photoHeight"
              : fileType === "homeGallery"
              ? "img-fluid"
              : fileType === "slider"
              ? "w-100 d-block"
              : ""
          }
          style={{
            cursor: "pointer",
            objectFit: "cover",
            maxHeight: fileType === "homeGallery" ? "342px" : undefined,
            height: fileType === "image" ? "100%" : fileType === "gallery" ? undefined : undefined,
          }}
          height={fileType === "image" ? "200px" : fileType === "image2" ? "180" : fileType === "gallery" ? "300" : undefined}
          width={fileType === "image2" ? "200" : fileType === "search" || fileType === "homeGallery" ? "200" : "100%"}
        />
      )}

      {/* PDF TYPES → resolve on click to avoid prefetch overhead */}
      {isPdfType && (
        <span
          style={{
            cursor: "pointer",
            color: fileType === "searchpdf" ? "var(--primary-color)" : "inherit",
            textDecoration: fileType === "pdf" ? "underline" : "none",
          }}
          onClick={openModal}
          title={fileTitle}
        >
          {fileType === "pdf2" && <i className="fa fa-file-pdf me-2 text-danger" />}
          {fileTitle}
        </span>
      )}

      {/* One universal modal for both images & PDFs */}
      <ContentModal show={showModal} handleClose={() => setShowModal(false)} content={modalUrl} />
    </>
  );
};

export default FileComponent;
