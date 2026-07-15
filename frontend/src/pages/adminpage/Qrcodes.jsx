import React, { useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Qrcodes = () => {
  const [tables, setTables] = useState([1, 2, 3]);
  const qrRefs = useRef([]);

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

  const downloadQr = (table, index) => {
    const canvas = qrRefs.current[index]?.querySelector("canvas");

    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `table-${table}-qr.png`;
    link.click();
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
        {tables.map((table, index) => {
          const qrValue = `${baseUrl}?table=${table}`;

          return (
            <div
              key={table}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">Table {table}</p>
                <button
                  type="button"
                  onClick={() => downloadQr(table, index)}
                  className="rounded-lg border border-amber-500 px-3 py-1 text-sm font-medium text-amber-600 transition hover:bg-amber-50"
                >
                  Download
                </button>
              </div>
              <div
                ref={(element) => {
                  qrRefs.current[index] = element;
                }}
                className="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-4 text-sm text-gray-500"
              >
                <QRCodeCanvas value={qrValue} size={180} level="H" />
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
