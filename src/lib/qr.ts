import { toDataURL, type QRCodeErrorCorrectionLevel, type QRCodeToDataURLOptions } from "qrcode";

export type ErrorCorrection = "L" | "M" | "Q" | "H";

export type QrDrawOptions = {
  text: string;
  size: number;
  foreground: string;
  background: string;
  errorCorrection: ErrorCorrection;
};

export async function renderQrDataUrl(options: QrDrawOptions): Promise<string> {
  const render: QRCodeToDataURLOptions = {
    errorCorrectionLevel: options.errorCorrection as QRCodeErrorCorrectionLevel,
    width: options.size,
    margin: 2,
    type: "image/png",
    color: {
      dark: options.foreground,
      light: options.background,
    },
  };
  try {
    return await toDataURL(options.text, render);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not generate this QR code.";
    if (/too big|cannot be encoded|capacity|data too long|code length overflow/i.test(message)) {
      throw new Error(
        "This text is too long for a QR code. Shorten it or choose a lower error-correction level.",
      );
    }
    throw new Error(message);
  }
}

export function downloadDataUrl(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.append(a);
  a.click();
  a.remove();
}
