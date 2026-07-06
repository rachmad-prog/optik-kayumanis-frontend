"use client";

import { useEffect, useRef, useState } from "react";
import {
  isUsbSupported,
  isBluetoothSupported,
  connectUsbPrinter,
  connectBluetoothPrinter,
  printViaUsb,
  printViaBluetooth,
  printViaBrowser,
  buildEscPosReceipt,
  PAPER_WIDTHS,
} from "../lib/thermalPrinter";

function PrinterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9V3.75A.75.75 0 0 1 6.75 3h10.5a.75.75 0 0 1 .75.75V9" />
      <rect x="4" y="9" width="16" height="8" rx="1.5" />
      <path d="M7 21h10v-5.25a.75.75 0 0 0-.75-.75H7.75a.75.75 0 0 0-.75.75V21Z" />
      <path d="M7.5 12h1.5" />
    </svg>
  );
}

function UsbIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v9" />
      <circle cx="12" cy="4.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M9 8l-2 2v4a2 2 0 0 0 2 2h1" />
      <path d="M15 8l2 2v2" />
      <circle cx="8" cy="18" r="2" />
      <path d="M17 12v3a2 2 0 0 1-2 2h-1" />
    </svg>
  );
}

function BluetoothIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6.5 8.5 17.5 16 12 20V4l5.5 4.5L6.5 16" />
    </svg>
  );
}

function Spinner(props) {
  return (
    <svg viewBox="0 0 24 24" className="animate-spin" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function PrintReceiptButton({ order }) {
  const [open, setOpen] = useState(false);
  const [paperWidth, setPaperWidth] = useState("58");
  const [connection, setConnection] = useState(null); // { type, label }
  const [busy, setBusy] = useState(""); // "" | "connect-usb" | "connect-bt" | "printing"
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const connRef = useRef(null); // holds actual device/characteristic refs (not put in state, not serializable-friendly)

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("thermalPrinterPaperWidth");
    if (saved && PAPER_WIDTHS[saved]) setPaperWidth(saved);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function choosePaperWidth(w) {
    setPaperWidth(w);
    localStorage.setItem("thermalPrinterPaperWidth", w);
  }

  async function handleConnectUsb() {
    setError("");
    setBusy("connect-usb");
    try {
      const conn = await connectUsbPrinter();
      connRef.current = conn;
      setConnection({ type: "usb", label: conn.label });
    } catch (err) {
      if (err.name !== "NotFoundError") setError(err.message || "Gagal menyambungkan printer USB.");
    } finally {
      setBusy("");
    }
  }

  async function handleConnectBluetooth() {
    setError("");
    setBusy("connect-bt");
    try {
      const conn = await connectBluetoothPrinter();
      connRef.current = conn;
      setConnection({ type: "bluetooth", label: conn.label });
      conn.device.addEventListener("gattserverdisconnected", () => {
        connRef.current = null;
        setConnection(null);
      });
    } catch (err) {
      if (err.name !== "NotFoundError") setError(err.message || "Gagal menyambungkan printer Bluetooth.");
    } finally {
      setBusy("");
    }
  }

  async function handlePrint() {
    setError("");
    setBusy("printing");
    try {
      if (connRef.current?.type === "usb") {
        const data = buildEscPosReceipt(order, paperWidth);
        await printViaUsb(connRef.current, data);
      } else if (connRef.current?.type === "bluetooth") {
        const data = buildEscPosReceipt(order, paperWidth);
        await printViaBluetooth(connRef.current, data);
      } else {
        printViaBrowser(order, paperWidth);
      }
      setOpen(false);
    } catch (err) {
      setError(err.message || "Gagal mencetak struk.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Cetak struk thermal"
        aria-label="Cetak struk thermal"
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
          open ? "border-cinnamon-500 bg-cinnamon-50 text-cinnamon-600" : "border-sand text-bark-500 hover:border-cinnamon-300 hover:text-cinnamon-600"
        }`}
      >
        <PrinterIcon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-sand bg-white p-4 shadow-lg">
          <p className="mb-3 font-display text-sm font-semibold text-bark-700">Cetak Struk Thermal</p>

          <div className="mb-3">
            <p className="mb-1.5 text-xs text-bark-300">Ukuran kertas</p>
            <div className="flex gap-2">
              {["58", "80"].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => choosePaperWidth(w)}
                  className={`flex-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    paperWidth === w
                      ? "border-cinnamon-500 bg-cinnamon-500 text-white"
                      : "border-sand text-bark-500 hover:border-cinnamon-300"
                  }`}
                >
                  {w}mm
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3 space-y-2">
            <p className="text-xs text-bark-300">Sambungkan printer (opsional)</p>

            <button
              type="button"
              onClick={handleConnectUsb}
              disabled={!isUsbSupported() || busy !== ""}
              className="flex w-full items-center justify-between rounded-xl border border-sand px-3 py-2 text-xs text-bark-500 hover:border-cinnamon-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <UsbIcon style={{ width: 15, height: 15 }} />
                {connection?.type === "usb" ? connection.label : "Printer USB"}
              </span>
              {busy === "connect-usb" ? (
                <Spinner style={{ width: 14, height: 14 }} />
              ) : connection?.type === "usb" ? (
                <span className="h-2 w-2 rounded-full bg-sage" />
              ) : (
                <span className="text-cinnamon-500">Sambungkan</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleConnectBluetooth}
              disabled={!isBluetoothSupported() || busy !== ""}
              className="flex w-full items-center justify-between rounded-xl border border-sand px-3 py-2 text-xs text-bark-500 hover:border-cinnamon-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <BluetoothIcon style={{ width: 15, height: 15 }} />
                {connection?.type === "bluetooth" ? connection.label : "Printer Bluetooth"}
              </span>
              {busy === "connect-bt" ? (
                <Spinner style={{ width: 14, height: 14 }} />
              ) : connection?.type === "bluetooth" ? (
                <span className="h-2 w-2 rounded-full bg-sage" />
              ) : (
                <span className="text-cinnamon-500">Sambungkan</span>
              )}
            </button>

            {(!isUsbSupported() || !isBluetoothSupported()) && (
              <p className="text-[11px] leading-relaxed text-bark-300">
                Sebagian koneksi tidak didukung browser ini — gunakan Chrome/Edge untuk USB atau Bluetooth langsung, atau cetak lewat browser di bawah.
              </p>
            )}
          </div>

          {error && <p className="mb-2 text-[11px] text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handlePrint}
            disabled={busy !== ""}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-cinnamon-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cinnamon-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "printing" ? (
              <Spinner style={{ width: 15, height: 15 }} />
            ) : (
              <PrinterIcon style={{ width: 15, height: 15 }} />
            )}
            {connection ? `Cetak ke ${connection.label}` : "Cetak lewat Browser"}
          </button>
        </div>
      )}
    </div>
  );
}
