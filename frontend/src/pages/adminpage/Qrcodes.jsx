import React from "react";

const Qrcodes = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">QR Codes</h1>
          <p className="text-gray-600">
            Manage table QR codes for quick ordering.
          </p>
        </div>
        <button className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">
          Generate New QR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="mb-2 font-semibold">Table {item}</p>
            <div className="flex h-32 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
              QR Preview
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Qrcodes;
