// App.jsx

import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./App.css";
import $ from "jquery";
import "turn.js";
import RightArrow from "./assets/right-arrow-svgrepo-com.svg";

const backurl = "https://api.misteraxel.pp.ua/";
function App() {
  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true)
  const [isRendering, setIsRendering] = useState(true);
  const [data, setData] = useState(null)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setTimeout(() => (setIsRendering(false)), 700)
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pdf = params.get("id");
    fetch(backurl + "pdfs/" + pdf, {
      method: "GET",
    }).then((res) =>
      res.json()).then((data) => {
        console.log(data)
        setData(data)
        fetch(data.link).then((res) => res.blob()).then((blob) => {

          setPdfUrl(blob);

          setLoading(false)
        })
      })



  }, [backurl]);


  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft" && currentPage > 1) {
        handlePrevPage();
      } else if (event.key === "ArrowRight" && currentPage < numPages) {
        handleNextPage();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentPage, numPages]);

  const handlePrevPage = () => {
    if (currentPage == 2) {

      setCurrentPage(currentPage - 1);
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 2);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      if (currentPage == 1) {

        setCurrentPage(currentPage + 1);
      } else if (numPages - 1 % 2 == 1 || currentPage != numPages - 1) {
        setCurrentPage(currentPage + 2);
      }
    }
  };

  return (
    <>

      <div className="App">
        <div className="viewbar">
          <span>
            {data?.Nombre.replace(/\b\w/g, function (l) { return l.toUpperCase() })}
          </span>
          <span>
            {data?.Empresa.toUpperCase()}
          </span>
        </div>

        {loading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "white", fontSize: "2rem" }}>Loading...</div> :
          <div>
            <div className="button-container">
              <button className={currentPage == 1 || currentPage == numPages ? ("peque") : ("grande")} onClick={handlePrevPage} disabled={currentPage === 1}>
                <img src={RightArrow} alt="right" style={{ transform: "rotate(180deg)", maxWidth: "30px" }} />
              </button>
              <button className={currentPage == 1 || currentPage == numPages ? ("peque") : ("grande")} onClick={handleNextPage} disabled={currentPage === numPages}>
                <img src={RightArrow} alt="right" style={{ maxWidth: "30px" }} />
              </button>
            </div>
            <div className="book-container" style={!isRendering ? { display: "flex" } : { display: "none" }}>
              <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className={"book"} renderMode="canvas "   >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", maxHeight: "100vh" }}>

                  <Page pageNumber={currentPage} height={ window.innerWidth < 1200 ? (window.innerHeight / 100) * 60 :((window.innerHeight / 100) * 85)} renderAnnotationLayer={false} renderTextLayer={false} devicePixelRatio={window.devicePixelRatio * 2} />
                  {
                    window.innerWidth > 1200 ? (
                      <>
                        <Page className={currentPage == 1 ? ("hidden") : ("") + " " + currentPage == numPages ? ("hidden") : ("")} pageNumber={currentPage + 1} height={(window.innerHeight / 100) * 85} renderAnnotationLayer={false} renderTextLayer={false} devicePixelRatio={window.devicePixelRatio * 2} />
                      </>) : null
                  }
                </div>

              </Document>
            </div>


          </div>}
        <p>
          Page {currentPage} of {numPages}
        </p>
      </div >
    </>
  );
}

export default App;


