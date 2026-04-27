import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QRScanner() {
  useEffect(() => {
    const element = document.getElementById("qr-reader");
    if (!element) {
      console.error("qr-reader div is missing!");
      return;
    }

    const scanner = new Html5Qrcode("qr-reader");

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          console.log("Scanned Result:", decodedText);
        },
        (error) => {
          console.warn("QR Error:", error);
        }
      )
      .catch((err) => console.error("Scanner start failed:", err));

    return () => {
      scanner.stop().catch((err) => console.error("Stop failed:", err));
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>QR Code Scanner</h2>
      <div
        id="qr-reader"
        style={{
          width: "300px",
          height: "300px",
          marginTop: "20px",
          border: "1px solid black",
        }}
      ></div>
    </div>
  );
}

export default QRScanner;
