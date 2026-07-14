import React, { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const Qrcodes = () => {
  const [tables, setTables] = useState([1, 2, 3]);

  const baseUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/menu`;
    }
    return "http://localhost:5173/menu";
  }, []);

  const generateNewQr = () => {
    const nextTable = tables.length + 1;
    setTables((prev) => [...prev, nextTable]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">QR Codes</h1>
          <p className="text-gray-600">
            Scan any table QR code to open the ordering page.
          </p>
        </div>
        <button
          onClick={generateNewQr}
          className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
        >
          Generate New QR
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => {
          const qrValue = `${baseUrl}?table=${table}`;

          return (
            <div
              key={table}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="mb-3 font-semibold">Table {table}</p>
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-4 text-sm text-gray-500">
                <QRCodeSVG value={qrValue} size={180} level="H" />
                <p className="mt-3 text-center text-xs text-gray-600">
                  Scan to open the menu for Table {table}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Qrcodes;
