import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrCodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("scanner");
        scannerRef.current = scanner;
        const cameras = await Html5Qrcode.getCameras();
        if (cameras.length > 0) {
          await scanner.start(cameras[0].id, {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          }, (decodedText) => {
            console.log(`Code matched = ${decodedText}`);
          });
          setIsScanning(true);
        } else {
          console.log("No cameras found.");
        }
      } catch (error) {
        console.error("Error starting the scanner:", error);
      }
    };

    startScanner();

    return () => {
      if (isScanning && scannerRef.current) {
        scannerRef.current.stop().then(() => {
          console.log("Scanner stopped");
        }).catch(err => {
          console.error("Error stopping the scanner:", err);
        });
      }
    };
  }, [isScanning]);

  return <div id="scanner" style={{ width: "500px" }} />;
};

export default QrCodeScanner;
