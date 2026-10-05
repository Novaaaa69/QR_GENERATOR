import { AlertTriangle, Download, QrCode } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { contrastRatio, isLowContrast, parseHex } from "@/lib/color";
import { downloadDataUrl, renderQrDataUrl, type ErrorCorrection } from "@/lib/qr";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "lattice-qr-settings";
const MIN_SIZE = 128;
const MAX_SIZE = 1024;
const SIZE_STEP = 8;
const DEFAULT_TEXT = "https://example.com";

const LEVELS: { id: ErrorCorrection; name: string; recovery: string }[] = [
  { id: "L", name: "Low", recovery: "7%" },
  { id: "M", name: "Medium", recovery: "15%" },
  { id: "Q", name: "Quartile", recovery: "25%" },
  { id: "H", name: "High", recovery: "30%" },
];

const PALETTES: { id: string; label: string; foreground: string; background: string }[] = [
  { id: "ink", label: "Ink", foreground: "#111111", background: "#ffffff" },
  { id: "invert", label: "Invert", foreground: "#f7f4ee", background: "#141311" },
  { id: "forest", label: "Forest", foreground: "#1e4a44", background: "#f3efe6" },
  { id: "night", label: "Night", foreground: "#d7dde6", background: "#12141a" },
];

type Settings = {
  text: string;
  foreground: string;
  background: string;
  size: number;
  errorCorrection: ErrorCorrection;
};

const DEFAULTS: Settings = {
  text: DEFAULT_TEXT,
  foreground: "#111111",
  background: "#ffffff",
  size: 320,
  errorCorrection: "M",
};

function isErrorCorrection(value: unknown): value is ErrorCorrection {
  return value === "L" || value === "M" || value === "Q" || value === "H";
}

function clampSize(value: number): number {
  if (!Number.isFinite(value)) return DEFAULTS.size;
  const snapped = Math.round(value / SIZE_STEP) * SIZE_STEP;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, snapped));
}

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    const foreground = parseHex(parsed.foreground ?? "") ?? DEFAULTS.foreground;
    const background = parseHex(parsed.background ?? "") ?? DEFAULTS.background;
    return {
      text: typeof parsed.text === "string" ? parsed.text : DEFAULTS.text,
      foreground,
      background,
      size: clampSize(typeof parsed.size === "number" ? parsed.size : DEFAULTS.size),
      errorCorrection: isErrorCorrection(parsed.errorCorrection)
        ? parsed.errorCorrection
        : DEFAULTS.errorCorrection,
    };
  } catch {
    return DEFAULTS;
  }
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <label
          className="relative size-11 shrink-0 overflow-hidden rounded-sm border border-border bg-surface shadow-sm focus-within:ring-2 focus-within:ring-ring"
          htmlFor={`${id}-swatch`}
        >
          <span className="sr-only">{label} color picker</span>
          <input
            id={`${id}-swatch`}
            type="color"
            value={value}
            onChange={(event) => {
              const next = parseHex(event.target.value);
              if (!next) return;
              onChange(next);
              setDraft(next);
            }}
            className="absolute -inset-1 size-[calc(100%+8px)] cursor-pointer"
          />
        </label>
        <Input
          id={id}
          value={draft}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label={`${label} hex color`}
          className="font-mono text-sm uppercase"
          onChange={(event) => {
            const nextDraft = event.target.value;
            setDraft(nextDraft);
            const parsed = parseHex(nextDraft);
            if (parsed) onChange(parsed);
          }}
          onBlur={() => setDraft(value)}
        />
      </div>
    </div>
  );
}

export function QrStudio() {
  const uid = useId();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const textId = `${uid}-text`;
  const fgId = `${uid}-fg`;
  const bgId = `${uid}-bg`;
  const sizeId = `${uid}-size`;
  const ecId = `${uid}-ec`;

  useEffect(() => {
    setSettings(readSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [hydrated, settings]);

  const trimmed = settings.text.trim();
  const lowContrast = useMemo(
    () => isLowContrast(settings.foreground, settings.background),
    [settings.foreground, settings.background],
  );
  const ratio = useMemo(
    () => contrastRatio(settings.foreground, settings.background),
    [settings.foreground, settings.background],
  );

  useEffect(() => {
    if (!trimmed) {
      setError(null);
      setDataUrl(null);
      return;
    }

    let cancelled = false;

    renderQrDataUrl({
      text: trimmed,
      size: settings.size,
      foreground: settings.foreground,
      background: settings.background,
      errorCorrection: settings.errorCorrection,
    })
      .then((url) => {
        if (cancelled) return;
        setError(null);
        setDataUrl(url);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setDataUrl(null);
        setError(err instanceof Error ? err.message : "Could not generate this QR code.");
      });

    return () => {
      cancelled = true;
    };
  }, [trimmed, settings.size, settings.foreground, settings.background, settings.errorCorrection]);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleDownload() {
    if (!dataUrl) return;
    downloadDataUrl(dataUrl, "lattice-qr.png");
  }

  const canDownload = Boolean(dataUrl) && !error && Boolean(trimmed);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="enter flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <QrCode className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight text-fg sm:text-4xl">
              Lattice
            </h1>
            <p className="mt-1 max-w-md text-muted">
              Type a URL or any text. The code updates as you go.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section className="enter enter-delay-1 order-1 min-w-0">
          <div className="rounded-xl bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor={textId}>Text or URL</Label>
              <span className="text-xs tabular-nums text-subtle">{settings.text.length} characters</span>
            </div>
            <Textarea
              id={textId}
              value={settings.text}
              onChange={(event) => update("text", event.target.value)}
              placeholder="https://example.com or any text"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              className="mt-3"
            />
          </div>
        </section>

        <aside className="enter enter-delay-2 order-2 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-8">
          <div className="rounded-xl bg-surface p-5 shadow-card">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-medium text-fg">Preview</h2>
              <p className="text-xs tabular-nums text-subtle">
                {settings.size} × {settings.size} px
              </p>
            </div>

            <div className="mt-4 overflow-hidden rounded-md bg-inset p-4">
              {dataUrl && !error ? (
                <img
                  src={dataUrl}
                  alt={`QR code for ${trimmed}`}
                  className="qr-canvas aspect-square w-full object-contain"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center">
                  {!trimmed ? (
                    <p className="px-4 text-center text-sm text-muted">
                      Type something to generate a code
                    </p>
                  ) : error ? (
                    <p className="px-4 text-center text-sm text-danger">{error}</p>
                  ) : null}
                </div>
              )}
            </div>

            {lowContrast && trimmed && !error ? (
              <p
                className="mt-3 flex items-start gap-2 rounded-md bg-warning-muted px-3 py-2 text-sm text-warning-foreground"
                role="status"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  Contrast {ratio.toFixed(1)}:1 — this code may not scan. Darken the foreground or
                  lighten the background.
                </span>
              </p>
            ) : null}

            <Button
              className="mt-4 w-full"
              onClick={handleDownload}
              disabled={!canDownload}
              aria-describedby={!canDownload ? `${uid}-download-hint` : undefined}
            >
              <Download aria-hidden />
              Download PNG
            </Button>
            {!canDownload ? (
              <p id={`${uid}-download-hint`} className="mt-2 text-center text-xs text-subtle">
                Enter text to enable download
              </p>
            ) : null}
          </div>
        </aside>

        <section className="enter enter-delay-3 order-3 flex min-w-0 flex-col gap-6 lg:col-start-1">
          <Controls
            fgId={fgId}
            bgId={bgId}
            sizeId={sizeId}
            ecId={ecId}
            settings={settings}
            update={update}
          />
        </section>
      </div>

      <p className="enter enter-delay-3 text-center text-xs text-subtle">
        Codes are generated in your browser. Nothing is uploaded.
      </p>
    </div>
  );
}

function Controls({
  fgId,
  bgId,
  sizeId,
  ecId,
  settings,
  update,
}: {
  fgId: string;
  bgId: string;
  sizeId: string;
  ecId: string;
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}) {
  return (
    <>
      <div className="rounded-xl bg-surface p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row">
          <ColorField
            id={fgId}
            label="Foreground"
            value={settings.foreground}
            onChange={(next) => update("foreground", next)}
          />
          <ColorField
            id={bgId}
            label="Background"
            value={settings.background}
            onChange={(next) => update("background", next)}
          />
        </div>
        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-fg">Palettes</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PALETTES.map((palette) => {
              const selected =
                settings.foreground === palette.foreground &&
                settings.background === palette.background;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => {
                    update("foreground", palette.foreground);
                    update("background", palette.background);
                  }}
                  aria-pressed={selected}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-sm border px-2.5 text-left text-sm font-medium transition-[background-color,border-color,box-shadow] duration-quick ease-out-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary bg-inset text-fg"
                      : "border-border bg-surface text-muted hover:bg-inset hover:text-fg",
                  )}
                >
                  <span
                    className="flex size-5 overflow-hidden rounded-xs border border-border"
                    aria-hidden
                  >
                    <span className="h-full w-1/2" style={{ backgroundColor: palette.foreground }} />
                    <span className="h-full w-1/2" style={{ backgroundColor: palette.background }} />
                  </span>
                  {palette.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="rounded-xl bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor={sizeId}>Size</Label>
          <output htmlFor={sizeId} className="text-sm tabular-nums text-muted">
            {settings.size} px
          </output>
        </div>
        <Slider
          id={sizeId}
          min={MIN_SIZE}
          max={MAX_SIZE}
          step={SIZE_STEP}
          value={[settings.size]}
          onValueChange={(value) => update("size", clampSize(value[0] ?? settings.size))}
          aria-label="QR code size in pixels"
          aria-valuetext={`${settings.size} pixels`}
        />
        <div className="flex justify-between text-xs tabular-nums text-subtle">
          <span>{MIN_SIZE}</span>
          <span>{MAX_SIZE}</span>
        </div>
      </div>

      <fieldset className="rounded-xl bg-surface p-5 shadow-card">
        <legend id={ecId} className="text-sm font-medium text-fg">
          Error correction
        </legend>
        <p className="mt-1 text-sm text-muted">
          Higher levels survive damage or marks, but make a denser code.
        </p>
        <div
          role="radiogroup"
          aria-labelledby={ecId}
          className="mt-4 grid grid-cols-4 gap-2"
        >
          {LEVELS.map((level) => {
            const selected = settings.errorCorrection === level.id;
            const optionId = `${ecId}-${level.id}`;
            return (
              <label
                key={level.id}
                htmlFor={optionId}
                className={cn(
                  "flex h-16 cursor-pointer flex-col items-center justify-center rounded-sm border px-1 text-center transition-[background-color,border-color,color] duration-quick ease-out-smooth has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-fg hover:bg-inset",
                )}
              >
                <input
                  id={optionId}
                  type="radio"
                  name={ecId}
                  value={level.id}
                  checked={selected}
                  onChange={() => update("errorCorrection", level.id)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{level.id}</span>
                <span className={cn("text-xs", selected ? "opacity-80" : "text-subtle")}>
                  {level.recovery}
                </span>
                <span className="sr-only">
                  {level.name} error correction, {level.recovery} recovery
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </>
  );
}
