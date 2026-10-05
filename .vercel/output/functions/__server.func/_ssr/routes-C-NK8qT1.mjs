import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as QrCode, r as Download, t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C-NK8qT1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = require_lib();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-quick ease-out-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 active:enabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
			outline: "border border-border bg-surface text-fg hover:bg-inset",
			ghost: "text-muted hover:bg-inset hover:text-fg",
			secondary: "bg-inset text-fg hover:bg-border"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Input({ className, type = "text", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("h-11 w-full rounded-sm border border-border bg-surface px-3 text-base text-fg shadow-sm outline-none transition-[box-shadow,border-color] duration-quick ease-out-smooth placeholder:text-subtle focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-sm font-medium leading-none text-fg", className),
		...props
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none select-none items-center py-3", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-inset",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "relative block size-5 rounded-full border border-primary bg-surface shadow-sm outline-none transition-[box-shadow,transform] duration-quick ease-out-smooth after:absolute after:left-1/2 after:top-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50" })]
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-32 w-full resize-y rounded-sm border border-border bg-surface px-3 py-3 text-base leading-normal text-fg shadow-sm outline-none transition-[box-shadow,border-color] duration-quick ease-out-smooth placeholder:text-subtle focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function parseHex(value) {
	let v = value.trim();
	if (!v) return null;
	if (!v.startsWith("#")) v = `#${v}`;
	if (/^#[0-9a-fA-F]{3}$/.test(v)) {
		const r = v[1];
		const g = v[2];
		const b = v[3];
		return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
	}
	if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toLowerCase();
	return null;
}
function channel(hex, index) {
	return Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
}
function linearize(c) {
	const s = c / 255;
	return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
}
function relativeLuminance(hex) {
	const r = linearize(channel(hex, 0));
	const g = linearize(channel(hex, 1));
	const b = linearize(channel(hex, 2));
	return .2126 * r + .7152 * g + .0722 * b;
}
function contrastRatio(a, b) {
	const l1 = relativeLuminance(a);
	const l2 = relativeLuminance(b);
	const light = Math.max(l1, l2);
	const dark = Math.min(l1, l2);
	return (light + .05) / (dark + .05);
}
function isLowContrast(fg, bg) {
	return contrastRatio(fg, bg) < 3;
}
async function renderQrDataUrl(options) {
	const render = {
		errorCorrectionLevel: options.errorCorrection,
		width: options.size,
		margin: 2,
		type: "image/png",
		color: {
			dark: options.foreground,
			light: options.background
		}
	};
	try {
		return await (0, import_lib.toDataURL)(options.text, render);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Could not generate this QR code.";
		if (/too big|cannot be encoded|capacity|data too long|code length overflow/i.test(message)) throw new Error("This text is too long for a QR code. Shorten it or choose a lower error-correction level.");
		throw new Error(message);
	}
}
function downloadDataUrl(url, filename) {
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.append(a);
	a.click();
	a.remove();
}
var STORAGE_KEY = "lattice-qr-settings";
var MIN_SIZE = 128;
var MAX_SIZE = 1024;
var SIZE_STEP = 8;
var DEFAULT_TEXT = "https://example.com";
var LEVELS = [
	{
		id: "L",
		name: "Low",
		recovery: "7%"
	},
	{
		id: "M",
		name: "Medium",
		recovery: "15%"
	},
	{
		id: "Q",
		name: "Quartile",
		recovery: "25%"
	},
	{
		id: "H",
		name: "High",
		recovery: "30%"
	}
];
var PALETTES = [
	{
		id: "ink",
		label: "Ink",
		foreground: "#111111",
		background: "#ffffff"
	},
	{
		id: "invert",
		label: "Invert",
		foreground: "#f7f4ee",
		background: "#141311"
	},
	{
		id: "forest",
		label: "Forest",
		foreground: "#1e4a44",
		background: "#f3efe6"
	},
	{
		id: "night",
		label: "Night",
		foreground: "#d7dde6",
		background: "#12141a"
	}
];
var DEFAULTS = {
	text: DEFAULT_TEXT,
	foreground: "#111111",
	background: "#ffffff",
	size: 320,
	errorCorrection: "M"
};
function isErrorCorrection(value) {
	return value === "L" || value === "M" || value === "Q" || value === "H";
}
function clampSize(value) {
	if (!Number.isFinite(value)) return DEFAULTS.size;
	const snapped = Math.round(value / SIZE_STEP) * SIZE_STEP;
	return Math.min(MAX_SIZE, Math.max(MIN_SIZE, snapped));
}
function readSettings() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULTS;
		const parsed = JSON.parse(raw);
		const foreground = parseHex(parsed.foreground ?? "") ?? DEFAULTS.foreground;
		const background = parseHex(parsed.background ?? "") ?? DEFAULTS.background;
		return {
			text: typeof parsed.text === "string" ? parsed.text : DEFAULTS.text,
			foreground,
			background,
			size: clampSize(typeof parsed.size === "number" ? parsed.size : DEFAULTS.size),
			errorCorrection: isErrorCorrection(parsed.errorCorrection) ? parsed.errorCorrection : DEFAULTS.errorCorrection
		};
	} catch {
		return DEFAULTS;
	}
}
function ColorField({ id, label, value, onChange }) {
	const [draft, setDraft] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		setDraft(value);
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-1 flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "relative size-11 shrink-0 overflow-hidden rounded-sm border border-border bg-surface shadow-sm focus-within:ring-2 focus-within:ring-ring",
				htmlFor: `${id}-swatch`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "sr-only",
					children: [label, " color picker"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `${id}-swatch`,
					type: "color",
					value,
					onChange: (event) => {
						const next = parseHex(event.target.value);
						if (!next) return;
						onChange(next);
						setDraft(next);
					},
					className: "absolute -inset-1 size-[calc(100%+8px)] cursor-pointer"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id,
				value: draft,
				spellCheck: false,
				autoCapitalize: "off",
				autoCorrect: "off",
				autoComplete: "off",
				"aria-label": `${label} hex color`,
				className: "font-mono text-sm uppercase",
				onChange: (event) => {
					const nextDraft = event.target.value;
					setDraft(nextDraft);
					const parsed = parseHex(nextDraft);
					if (parsed) onChange(parsed);
				},
				onBlur: () => setDraft(value)
			})]
		})]
	});
}
function QrStudio() {
	const uid = (0, import_react.useId)();
	const [settings, setSettings] = (0, import_react.useState)(DEFAULTS);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [dataUrl, setDataUrl] = (0, import_react.useState)(null);
	const textId = `${uid}-text`;
	const fgId = `${uid}-fg`;
	const bgId = `${uid}-bg`;
	const sizeId = `${uid}-size`;
	const ecId = `${uid}-ec`;
	(0, import_react.useEffect)(() => {
		setSettings(readSettings());
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	}, [hydrated, settings]);
	const trimmed = settings.text.trim();
	const lowContrast = (0, import_react.useMemo)(() => isLowContrast(settings.foreground, settings.background), [settings.foreground, settings.background]);
	const ratio = (0, import_react.useMemo)(() => contrastRatio(settings.foreground, settings.background), [settings.foreground, settings.background]);
	(0, import_react.useEffect)(() => {
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
			errorCorrection: settings.errorCorrection
		}).then((url) => {
			if (cancelled) return;
			setError(null);
			setDataUrl(url);
		}).catch((err) => {
			if (cancelled) return;
			setDataUrl(null);
			setError(err instanceof Error ? err.message : "Could not generate this QR code.");
		});
		return () => {
			cancelled = true;
		};
	}, [
		trimmed,
		settings.size,
		settings.foreground,
		settings.background,
		settings.errorCorrection
	]);
	function update(key, value) {
		setSettings((prev) => ({
			...prev,
			[key]: value
		}));
	}
	function handleDownload() {
		if (!dataUrl) return;
		downloadDataUrl(dataUrl, "lattice-qr.png");
	}
	const canDownload = Boolean(dataUrl) && !error && Boolean(trimmed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-5xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "enter flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
							className: "size-5",
							strokeWidth: 1.75,
							"aria-hidden": true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-medium tracking-tight text-fg sm:text-4xl",
						children: "Lattice"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-md text-muted",
						children: "Type a URL or any text. The code updates as you go."
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "enter enter-delay-1 order-1 min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-surface p-5 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: textId,
									children: "Text or URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs tabular-nums text-subtle",
									children: [settings.text.length, " characters"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: textId,
								value: settings.text,
								onChange: (event) => update("text", event.target.value),
								placeholder: "https://example.com or any text",
								spellCheck: false,
								autoCapitalize: "off",
								autoCorrect: "off",
								autoComplete: "off",
								className: "mt-3"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "enter enter-delay-2 order-2 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-surface p-5 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-sm font-medium text-fg",
										children: "Preview"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs tabular-nums text-subtle",
										children: [
											settings.size,
											" × ",
											settings.size,
											" px"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 overflow-hidden rounded-md bg-inset p-4",
									children: dataUrl && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: dataUrl,
										alt: `QR code for ${trimmed}`,
										className: "qr-canvas aspect-square w-full object-contain"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex aspect-square items-center justify-center",
										children: !trimmed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "px-4 text-center text-sm text-muted",
											children: "Type something to generate a code"
										}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "px-4 text-center text-sm text-danger",
											children: error
										}) : null
									})
								}),
								lowContrast && trimmed && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 flex items-start gap-2 rounded-md bg-warning-muted px-3 py-2 text-sm text-warning-foreground",
									role: "status",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
										className: "mt-0.5 size-4 shrink-0",
										"aria-hidden": true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Contrast ",
										ratio.toFixed(1),
										":1 — this code may not scan. Darken the foreground or lighten the background."
									] })]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "mt-4 w-full",
									onClick: handleDownload,
									disabled: !canDownload,
									"aria-describedby": !canDownload ? `${uid}-download-hint` : void 0,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { "aria-hidden": true }), "Download PNG"]
								}),
								!canDownload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									id: `${uid}-download-hint`,
									className: "mt-2 text-center text-xs text-subtle",
									children: "Enter text to enable download"
								}) : null
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "enter enter-delay-3 order-3 flex min-w-0 flex-col gap-6 lg:col-start-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controls, {
							fgId,
							bgId,
							sizeId,
							ecId,
							settings,
							update
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "enter enter-delay-3 text-center text-xs text-subtle",
				children: "Codes are generated in your browser. Nothing is uploaded."
			})
		]
	});
}
function Controls({ fgId, bgId, sizeId, ecId, settings, update }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-surface p-5 shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
					id: fgId,
					label: "Foreground",
					value: settings.foreground,
					onChange: (next) => update("foreground", next)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
					id: bgId,
					label: "Background",
					value: settings.background,
					onChange: (next) => update("background", next)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "text-sm font-medium text-fg",
					children: "Palettes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
					children: PALETTES.map((palette) => {
						const selected = settings.foreground === palette.foreground && settings.background === palette.background;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								update("foreground", palette.foreground);
								update("background", palette.background);
							},
							"aria-pressed": selected,
							className: cn("flex h-11 items-center gap-2 rounded-sm border px-2.5 text-left text-sm font-medium transition-[background-color,border-color,box-shadow] duration-quick ease-out-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selected ? "border-primary bg-inset text-fg" : "border-border bg-surface text-muted hover:bg-inset hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex size-5 overflow-hidden rounded-xs border border-border",
								"aria-hidden": true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-full w-1/2",
									style: { backgroundColor: palette.foreground }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-full w-1/2",
									style: { backgroundColor: palette.background }
								})]
							}), palette.label]
						}, palette.id);
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-surface p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: sizeId,
						children: "Size"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("output", {
						htmlFor: sizeId,
						className: "text-sm tabular-nums text-muted",
						children: [settings.size, " px"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					id: sizeId,
					min: MIN_SIZE,
					max: MAX_SIZE,
					step: SIZE_STEP,
					value: [settings.size],
					onValueChange: (value) => update("size", clampSize(value[0] ?? settings.size)),
					"aria-label": "QR code size in pixels",
					"aria-valuetext": `${settings.size} pixels`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-xs tabular-nums text-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: MIN_SIZE }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: MAX_SIZE })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
			className: "rounded-xl bg-surface p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					id: ecId,
					className: "text-sm font-medium text-fg",
					children: "Error correction"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Higher levels survive damage or marks, but make a denser code."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "radiogroup",
					"aria-labelledby": ecId,
					className: "mt-4 grid grid-cols-4 gap-2",
					children: LEVELS.map((level) => {
						const selected = settings.errorCorrection === level.id;
						const optionId = `${ecId}-${level.id}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: optionId,
							className: cn("flex h-16 cursor-pointer flex-col items-center justify-center rounded-sm border px-1 text-center transition-[background-color,border-color,color] duration-quick ease-out-smooth has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-fg hover:bg-inset"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: optionId,
									type: "radio",
									name: ecId,
									value: level.id,
									checked: selected,
									onChange: () => update("errorCorrection", level.id),
									className: "sr-only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: level.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("text-xs", selected ? "opacity-80" : "text-subtle"),
									children: level.recovery
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sr-only",
									children: [
										level.name,
										" error correction, ",
										level.recovery,
										" recovery"
									]
								})
							]
						}, level.id);
					})
				})
			]
		})
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "px-4 py-8 sm:px-6 sm:py-12 lg:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrStudio, {})
	});
}
//#endregion
export { Home as component };
