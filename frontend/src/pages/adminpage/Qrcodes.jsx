import React, { useMemo, useRef, useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

const Qrcodes = () => {
  const [tables, setTables] = useState([1, 2, 3]);
  const qrRefs = useRef([]);
  const logoSrc = "/logo.png";

  const baseUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/menu`;
    }
    return "http://localhost:5173/menu";
  }, []);

  const generateNewQr = () => {
    const max = tables.length ? Math.max(...tables) : 0;
    const nextTable = max + 1;
    const next = [...tables, nextTable];
    setTables(next);
    try {
      localStorage.setItem("dm_qr_tables", JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const deleteQr = (table) => {
    if (!confirm(`Delete QR for Table ${table}?`)) return;
    const next = tables.filter((t) => t !== table);
    setTables(next);
    try {
      localStorage.setItem("dm_qr_tables", JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const downloadQr = (table, index) => {
    const qrWrapper = qrRefs.current[index];
    const canvas = qrWrapper?.querySelector("canvas");

    if (!canvas) return;

    const qrImage = new Image();
    qrImage.src = canvas.toDataURL("image/png");

    const logoImage = new Image();
    logoImage.crossOrigin = "anonymous";
    logoImage.src = logoSrc;

    const outputCanvas = document.createElement("canvas");
    const width = 1000;
    const height = 1280;
    outputCanvas.width = width;
    outputCanvas.height = height;
    const ctx = outputCanvas.getContext("2d");

    const drawDecoratedQr = () => {
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#f8f1e6";
      ctx.fillRect(40, 40, width - 80, height - 80);

      const headerGradient = ctx.createLinearGradient(40, 40, width - 40, 180);
      headerGradient.addColorStop(0, "#f59e0b");
      headerGradient.addColorStop(1, "#ea580c");
      ctx.fillStyle = headerGradient;
      ctx.fillRect(40, 40, width - 80, 240);

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      const logoSize = 150;
      const logoX = width / 2 - logoSize / 2;
      const logoY = 70;
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        logoX + logoSize / 2,
        logoY + logoSize / 2,
        logoSize / 2 + 12,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.clip();
      ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 52px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Digital Menu", width / 2, 260);

      ctx.font = "500 32px Inter, sans-serif";
      ctx.fillText(`Table ${table} QR Code`, width / 2, 310);

      ctx.fillStyle = "#334155";
      ctx.font = "400 22px Inter, sans-serif";
      ctx.fillText("Scan to open the ordering menu instantly", width / 2, 350);

      const qrSize = 720;
      const qrX = width / 2 - qrSize / 2;
      const qrY = 390;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 8;
      ctx.strokeRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48);
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      ctx.fillStyle = "#475569";
      ctx.font = "600 26px Inter, sans-serif";
      ctx.fillText("Powered by Digital Menu", width / 2, qrY + qrSize + 80);

      const link = document.createElement("a");
      link.href = outputCanvas.toDataURL("image/png");
      link.download = `table-${table}-qr.png`;
      link.click();
    };

    const tryDraw = () => {
      if (logoImage.complete && qrImage.complete) {
        drawDecoratedQr();
      }
    };

    logoImage.onload = tryDraw;
    qrImage.onload = tryDraw;
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dm_qr_tables");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTables(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("dm_qr_tables", JSON.stringify(tables));
    } catch (e) {
      // ignore
    }
  }, [tables]);

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
              className="rounded-[32px] border border-gray-200 bg-gradient-to-b from-orange-50 via-white to-white p-6 shadow-[0_18px_55px_-30px_rgba(251,146,60,0.65)]"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-500">
                    Digital Menu
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Table {table} QR
                  </h2>
                </div>
                <img
                  src={logoSrc}
                  alt="logo"
                  className="h-16 w-16 rounded-3xl border border-white bg-white p-2 shadow-sm"
                />
              </div>

              <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
                <div
                  ref={(element) => {
                    qrRefs.current[index] = element;
                  }}
                  className="flex flex-col items-center justify-center"
                >
                  <QRCodeCanvas value={qrValue} size={220} level="H" />
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-slate-600">
                Scan to open the menu for Table {table}.
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => downloadQr(table, index)}
                  className="flex-1 rounded-3xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Download QR with Logo
                </button>
                <button
                  type="button"
                  onClick={() => deleteQr(table)}
                  className="rounded-3xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  title={`Delete Table ${table} QR`}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Qrcodes;
