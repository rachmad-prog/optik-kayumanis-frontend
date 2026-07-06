// lib/thermalPrinter.js
//
// Utility murni JS (tanpa dependency React) untuk mencetak struk pesanan ke
// printer thermal (58mm / 80mm) via:
//   - WebUSB   (printer thermal yang disambungkan lewat kabel USB)
//   - Web Bluetooth (printer thermal BLE — kebanyakan printer thermal murah
//     yang mendukung "Bluetooth Low Energy printing")
//   - Fallback: cetak lewat dialog print browser biasa (bekerja untuk semua
//     printer yang sudah ter-install sebagai printer sistem, baik USB
//     maupun Bluetooth Classic/SPP yang tidak bisa diakses Web Bluetooth).
//
// Catatan: WebUSB & Web Bluetooth hanya tersedia di browser berbasis
// Chromium (Chrome, Edge, Opera, Android WebView Chrome) dan harus dipicu
// dari user-gesture (klik tombol). Tidak tersedia di Firefox/Safari — di
// browser tsb gunakan fallback cetak browser.

const ESC = 0x1b;
const GS = 0x1d;

function bytes(...arr) {
  return new Uint8Array(arr);
}

function concatBytes(chunks) {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

const textEncoder = new TextEncoder();

function textBytes(str) {
  return textEncoder.encode(str);
}

// ---- ESC/POS command helpers ----
const cmd = {
  init: () => bytes(ESC, 0x40), // ESC @  — reset printer
  alignLeft: () => bytes(ESC, 0x61, 0x00),
  alignCenter: () => bytes(ESC, 0x61, 0x01),
  alignRight: () => bytes(ESC, 0x61, 0x02),
  boldOn: () => bytes(ESC, 0x45, 0x01),
  boldOff: () => bytes(ESC, 0x45, 0x00),
  doubleOn: () => bytes(GS, 0x21, 0x11), // double width + height
  doubleOff: () => bytes(GS, 0x21, 0x00),
  feed: (n = 1) => bytes(ESC, 0x64, n), // ESC d n — feed n lines
  cut: () => bytes(GS, 0x56, 0x01), // partial cut
};

function line(str = "") {
  return textBytes(str + "\n");
}

// Word-wrap plain text to a fixed column width.
function wrapText(str, width) {
  const words = String(str).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (!current.length) {
      current = word;
    } else if ((current + " " + word).length <= width) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current.length) lines.push(current);
  return lines.length ? lines : [""];
}

// Left text .... right text, padded to column width (for item/price rows).
function twoCol(left, right, width) {
  const space = width - left.length - right.length;
  if (space > 0) return left + " ".repeat(space) + right;
  // If left too long, wrap left and put right on same line as last wrap.
  const wrapped = wrapText(left, width - right.length - 1);
  const last = wrapped.pop();
  const pad = width - last.length - right.length;
  wrapped.push(last + " ".repeat(Math.max(pad, 1)) + right);
  return wrapped.join("\n");
}

function formatRupiahPlain(n) {
  return "Rp" + Math.round(n || 0).toLocaleString("id-ID");
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr || "-";
  }
}

const STATUS_LABEL = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  EXPIRED: "Kedaluwarsa",
};

export const STORE_INFO = {
  name: "OPTIK KAYUMANIS",
  address: "Jl. Kayumanis No. 12, Bogor, Jawa Barat",
  contact: "halo@optikkayumanis.com",
};

// Kolom karakter per baris untuk font normal (Font A) di kertas 58mm / 80mm.
export const PAPER_WIDTHS = {
  "58": 32,
  "80": 48,
};

// Bangun struk dalam bentuk baris teks (dipakai juga untuk preview & fallback print)
export function buildReceiptLines(order, paperWidth = "58") {
  const width = PAPER_WIDTHS[paperWidth] || 32;
  const divider = "-".repeat(width);
  const out = [];

  out.push({ text: STORE_INFO.name, align: "center", bold: true });
  wrapText(STORE_INFO.address, width).forEach((t) => out.push({ text: t, align: "center" }));
  out.push({ text: STORE_INFO.contact, align: "center" });
  out.push({ text: divider });

  out.push({ text: `No: ${order.orderNumber}` });
  out.push({ text: formatDate(order.createdAt || order.paidAt) });
  out.push({ text: `Status: ${STATUS_LABEL[order.status] || order.status}` });
  out.push({ text: divider });

  out.push({ text: `${order.user?.name || order.recipientName || "-"}` });
  if (order.user?.email) out.push({ text: order.user.email });
  out.push({ text: divider });

  (order.items || []).forEach((item) => {
    wrapText(item.name, width).forEach((t) => out.push({ text: t }));
    const qtyPrice = `${item.quantity} x ${formatRupiahPlain(item.price)}`;
    const rowTotal = formatRupiahPlain(item.price * item.quantity);
    twoCol(qtyPrice, rowTotal, width).split("\n").forEach((t) => out.push({ text: t }));
  });
  out.push({ text: divider });

  if (order.subtotal != null) {
    twoCol("Subtotal", formatRupiahPlain(order.subtotal), width)
      .split("\n")
      .forEach((t) => out.push({ text: t }));
  }
  if (order.shippingCost != null) {
    twoCol("Ongkos Kirim", formatRupiahPlain(order.shippingCost), width)
      .split("\n")
      .forEach((t) => out.push({ text: t }));
  }
  out.push({ text: divider });
  twoCol("TOTAL", formatRupiahPlain(order.total), width)
    .split("\n")
    .forEach((t) => out.push({ text: t, bold: true, double: true }));
  out.push({ text: divider });

  out.push({ text: "Kirim ke:" });
  wrapText(order.recipientName || "-", width).forEach((t) => out.push({ text: t }));
  wrapText(order.shippingAddress || "-", width).forEach((t) => out.push({ text: t }));
  wrapText(`${order.city || ""}, ${order.province || ""} ${order.postalCode || ""}`, width).forEach((t) =>
    out.push({ text: t })
  );
  out.push({ text: "" });
  out.push({ text: "Terima kasih telah berbelanja!", align: "center" });
  out.push({ text: "" });

  return out;
}

// Bangun byte ESC/POS siap kirim ke printer (USB / Bluetooth).
export function buildEscPosReceipt(order, paperWidth = "58") {
  const rows = buildReceiptLines(order, paperWidth);
  const chunks = [cmd.init(), cmd.alignLeft()];
  let curAlign = "left";
  let curBold = false;
  let curDouble = false;

  for (const row of rows) {
    const align = row.align || "left";
    if (align !== curAlign) {
      chunks.push(align === "center" ? cmd.alignCenter() : align === "right" ? cmd.alignRight() : cmd.alignLeft());
      curAlign = align;
    }
    const bold = !!row.bold;
    if (bold !== curBold) {
      chunks.push(bold ? cmd.boldOn() : cmd.boldOff());
      curBold = bold;
    }
    const dbl = !!row.double;
    if (dbl !== curDouble) {
      chunks.push(dbl ? cmd.doubleOn() : cmd.doubleOff());
      curDouble = dbl;
    }
    chunks.push(line(row.text));
  }

  chunks.push(cmd.boldOff(), cmd.doubleOff(), cmd.alignLeft(), cmd.feed(3), cmd.cut());
  return concatBytes(chunks);
}

// ---------------- WebUSB ----------------

export function isUsbSupported() {
  return typeof navigator !== "undefined" && !!navigator.usb;
}

// Meminta user memilih printer USB yang sudah dipasangkan ke komputer/HP.
export async function connectUsbPrinter() {
  if (!isUsbSupported()) throw new Error("WebUSB tidak didukung di browser ini. Gunakan Chrome/Edge di desktop atau Android.");
  const device = await navigator.usb.requestDevice({ filters: [] });
  await device.open();
  if (!device.configuration) await device.selectConfiguration(1);

  // Cari interface printer (biasanya class 7) atau interface vendor-specific pertama yang punya endpoint OUT.
  let targetInterface = null;
  let outEndpoint = null;
  for (const cfg of device.configurations) {
    for (const itf of cfg.interfaces) {
      const alt = itf.alternates[0];
      const out = alt.endpoints.find((e) => e.direction === "out");
      if (out) {
        targetInterface = itf.interfaceNumber;
        outEndpoint = out.endpointNumber;
        break;
      }
    }
    if (targetInterface != null) break;
  }
  if (targetInterface == null) throw new Error("Tidak menemukan endpoint printer pada perangkat USB ini.");

  await device.claimInterface(targetInterface);
  return { type: "usb", device, endpoint: outEndpoint, label: device.productName || "Printer USB" };
}

export async function printViaUsb(connection, data) {
  await connection.device.transferOut(connection.endpoint, data);
}

// ---------------- Web Bluetooth ----------------

export function isBluetoothSupported() {
  return typeof navigator !== "undefined" && !!navigator.bluetooth;
}

// UUID service/characteristic yang umum dipakai printer thermal BLE murah.
// Karena tiap vendor bisa beda, kita coba beberapa kandidat, dan sebagai
// fallback terakhir kita scan semua service milik device untuk menemukan
// characteristic yang bisa ditulis (write / writeWithoutResponse).
const BLE_CANDIDATES = [
  { service: "000018f0-0000-1000-8000-00805f9b34fb", characteristic: "00002af1-0000-1000-8000-00805f9b34fb" },
  { service: "49535343-fe7d-4ae5-8fa9-9fafd205e455", characteristic: "49535343-8841-43f4-a8d4-ecbe34729bb3" },
];

export async function connectBluetoothPrinter() {
  if (!isBluetoothSupported())
    throw new Error("Web Bluetooth tidak didukung di browser ini. Gunakan Chrome/Edge di desktop atau Android.");

  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: BLE_CANDIDATES.map((c) => c.service),
  });

  const server = await device.gatt.connect();

  // Coba kandidat UUID yang diketahui dahulu.
  for (const candidate of BLE_CANDIDATES) {
    try {
      const service = await server.getPrimaryService(candidate.service);
      const characteristic = await service.getCharacteristic(candidate.characteristic);
      return { type: "bluetooth", device, characteristic, label: device.name || "Printer Bluetooth" };
    } catch {
      // lanjut coba kandidat berikutnya
    }
  }

  // Fallback: scan semua service untuk characteristic yang bisa ditulis.
  const services = await server.getPrimaryServices();
  for (const service of services) {
    const characteristics = await service.getCharacteristics();
    const writable = characteristics.find((c) => c.properties.write || c.properties.writeWithoutResponse);
    if (writable) {
      return { type: "bluetooth", device, characteristic: writable, label: device.name || "Printer Bluetooth" };
    }
  }

  throw new Error("Tidak menemukan characteristic yang bisa ditulis pada printer Bluetooth ini.");
}

// BLE punya batas ukuran paket (umumnya ~20 byte tanpa negosiasi MTU), jadi
// data dikirim bertahap per potongan kecil dengan jeda singkat.
export async function printViaBluetooth(connection, data, chunkSize = 180) {
  const { characteristic } = connection;
  const writeFn = characteristic.properties.writeWithoutResponse
    ? (chunk) => characteristic.writeValueWithoutResponse(chunk)
    : (chunk) => characteristic.writeValue(chunk);

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await writeFn(chunk);
    // beri jeda kecil supaya buffer printer tidak overflow
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

// ---------------- Fallback: cetak lewat dialog print browser ----------------
// Berguna untuk printer thermal yang sudah ter-install sebagai printer
// sistem (driver USB/Bluetooth bawaan), atau browser yang tidak mendukung
// WebUSB/Web Bluetooth (Firefox, Safari, iOS).
export function printViaBrowser(order, paperWidth = "58") {
  const rows = buildReceiptLines(order, paperWidth);
  const widthMm = paperWidth === "80" ? 80 : 58;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Struk ${order.orderNumber}</title>
<style>
  @page { size: ${widthMm}mm auto; margin: 0; }
  html, body {
    margin: 0; padding: 0;
    width: ${widthMm}mm;
    font-family: "Courier New", monospace;
    font-size: 11px;
    color: #000;
  }
  .receipt { padding: 6px 8px; }
  .center { text-align: center; }
  .bold { font-weight: 700; }
  .double { font-size: 16px; }
  p { margin: 0 0 2px 0; white-space: pre-wrap; }
</style>
</head>
<body>
  <div class="receipt">
    ${rows
      .map((r) => {
        const classes = [r.align === "center" ? "center" : "", r.bold ? "bold" : "", r.double ? "double" : ""]
          .filter(Boolean)
          .join(" ");
        const text = (r.text || "&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<p class="${classes}">${text || "&nbsp;"}</p>`;
      })
      .join("\n")}
  </div>
  <script>
    window.onload = function () {
      window.focus();
      window.print();
      setTimeout(function(){ window.close(); }, 300);
    };
  </script>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) throw new Error("Popup diblokir browser. Izinkan pop-up untuk mencetak struk.");
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
