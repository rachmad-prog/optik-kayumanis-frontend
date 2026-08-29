"use client";

// Context ini bikin koneksi printer thermal (USB/Bluetooth) jadi GLOBAL
// satu halaman, bukan per-tombol. Kenapa perlu: PrintReceiptButton dirender
// satu kali PER PESANAN di /admin/orders (bisa puluhan sekaligus). Kalau
// koneksi USB/Bluetooth disimpan di state lokal tiap tombol:
//   - auto-reconnect USB saat halaman dibuka akan jalan bersamaan di
//     SEMUA tombol -> rebutan claim ke device USB yang sama -> gagal.
//   - begitu admin sambungkan printer lewat SATU pesanan, pesanan lain
//     tetap menampilkan status "belum tersambung" walau device fisiknya
//     sama.
// Dengan context ini, connect sekali dari mana saja langsung kebaca di
// semua tombol pesanan pada halaman yang sama.

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  isUsbSupported,
  isBluetoothSupported,
  connectUsbPrinter,
  reconnectUsbPrinter,
  connectBluetoothPrinter,
  printViaUsb,
  printViaBluetooth,
} from "../lib/thermalPrinter";

const PrinterContext = createContext(null);

export function PrinterProvider({ children }) {
  const [connection, setConnection] = useState(null); // { type: "usb"|"bluetooth", label }
  const [busy, setBusy] = useState(""); // "" | "connect-usb" | "connect-bt"
  const [error, setError] = useState("");
  const connRef = useRef(null); // simpan device/characteristic asli, tidak perlu re-render saat berubah

  // Auto-reconnect printer USB yang sudah pernah diizinkan sebelumnya —
  // TIDAK memunculkan dialog pemilihan device, jadi aman dipanggil otomatis
  // tanpa klik user. Hanya jalan SEKALI untuk seluruh halaman (bukan per
  // tombol pesanan) karena provider ini dipasang sekali di level halaman.
  // Kalau tidak ada printer USB yang cocok, diam-diam gagal tanpa
  // mengganggu UI.
  //
  // Bluetooth sengaja TIDAK di-auto-reconnect: Web Bluetooth tidak
  // mendukung ini sekonsisten WebUSB antar versi Chrome, jadi tetap wajib
  // klik "Sambungkan" tiap sesi/refresh halaman.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const conn = await reconnectUsbPrinter();
      if (conn && !cancelled) {
        connRef.current = conn;
        setConnection({ type: "usb", label: conn.label });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Kalau printer USB dicabut fisik, bersihkan status koneksi supaya semua
  // tombol pesanan kembali ke "Printer USB" / "Cetak lewat Browser".
  useEffect(() => {
    if (!isUsbSupported()) return;
    function handleUsbDisconnect(e) {
      if (connRef.current?.type === "usb" && e.device === connRef.current.device) {
        connRef.current = null;
        setConnection(null);
      }
    }
    navigator.usb.addEventListener("disconnect", handleUsbDisconnect);
    return () => navigator.usb.removeEventListener("disconnect", handleUsbDisconnect);
  }, []);

  async function connectUsb() {
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

  async function connectBluetooth() {
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

  // Kirim data mentah (bytes ESC/POS) ke printer yang sedang tersambung.
  // Lempar error kalau tidak ada koneksi aktif — pemanggil (PrintReceiptButton)
  // yang menentukan fallback ke cetak browser kalau belum ada printer.
  async function printRaw(data) {
    if (connRef.current?.type === "usb") {
      await printViaUsb(connRef.current, data);
    } else if (connRef.current?.type === "bluetooth") {
      await printViaBluetooth(connRef.current, data);
    } else {
      throw new Error("Tidak ada printer yang tersambung.");
    }
  }

  return (
    <PrinterContext.Provider
      value={{
        connection,
        busy,
        error,
        setError,
        connectUsb,
        connectBluetooth,
        printRaw,
        isUsbSupported: isUsbSupported(),
        isBluetoothSupported: isBluetoothSupported(),
      }}
    >
      {children}
    </PrinterContext.Provider>
  );
}

export function usePrinter() {
  return useContext(PrinterContext);
}
