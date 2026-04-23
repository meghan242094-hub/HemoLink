import React from 'react';
import QRCode from 'qrcode.react';

/**
 * QRCode Component
 * Displays a QR code for the application URL
 */
const QRCodeDisplay = () => {
  // Use network IP for mobile access instead of localhost
  // This allows mobile devices on the same network to access the app
  const appUrl = 'http://192.168.0.137:3000';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Scan to Access on Mobile
      </h3>
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
        <QRCode
          value={appUrl}
          size={200}
          level="H"
          includeMargin={true}
          renderAs="svg"
          className="w-full h-auto"
        />
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Scan this QR code with your phone camera to access HemoLink on your mobile device
      </p>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Make sure your phone is on the same WiFi network
      </p>
    </div>
  );
};

export default QRCodeDisplay;
