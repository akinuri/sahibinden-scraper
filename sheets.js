// #region ==================== ELEMENTS-BY-TEXT

function getElementsByText(text, parent) {
    if (parent === undefined) {
        parent = document;
    }
    if (typeof parent == "string") {
        parent = document.querySelector(parent);
    }
    if (parent === null) {
        return [];
    }
    let elements = parent.querySelectorAll("*");
    let candidates = [];
    text = innerText(text, { linearize: true });
    let hasPattern = isWrappedWith(text, "/");
    if (hasPattern) {
        text = unwrap(text, "/");
    }
    let textPattern = new RegExp("^" + text + "$", "i");
    for (let element of elements) {
        let elementText = innerText(element, { linearize: true });
        if (hasPattern) {
            if (textPattern.test(elementText)) {
                candidates.push(element);
            }
        } else {
            if (elementText === text) {
                candidates.push(element);
            }
        }
    }
    if (candidates.length === 0) {
        return [];
    }
    candidates.sort((a, b) => a.children.length - b.children.length);
    const minChildren = candidates[0].children.length || 1;
    return candidates.filter((element) => element.children.length <= minChildren);
}

function innerText(el, options = {}) {
    let text = "";
    const { multilineThreshold = 20, hiddenParentDepth = 2, linearize = false } = options;
    if (el instanceof Element) {
        text = el.innerText || "";
        let isMultiline = text.includes("\n") || text.length > multilineThreshold;
        if (isMultiline) {
            const hiderParent = findHiddenParent(el, hiddenParentDepth);
            if (hiderParent) {
                const hideMethod = getHideMethod(hiderParent);
                let originalValue;
                try {
                    originalValue = hideEl(hiderParent, hideMethod);
                    text = el.innerText;
                } finally {
                    unhideEl(hiderParent, hideMethod, originalValue);
                }
            }
        }
        if (!text || text.trim() === "") {
            text = el.textContent;
        }
    } else if (typeof el === "string") {
        text = el;
    }
    text = text?.trim().replace(/ +/g, " ");
    if (linearize) {
        text = text.replace(/\n+/g, "");
    }
    return text;
}

function findHiddenParent(el, maxDepth = 5) {
    let current = el;
    let depth = 0;
    while (current && current !== document.body && depth < maxDepth) {
        const style = getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0" || current.hidden) {
            return current;
        }
        current = current.parentElement;
        depth++;
    }
    return null;
}

function getHideMethod(el) {
    const style = getComputedStyle(el);
    if (style.display === "none") return "display";
    if (style.visibility === "hidden") return "visibility";
    if (style.opacity === "0") return "opacity";
    if (el.hidden) return "hidden";
    return null;
}

function hideEl(el, method) {
    switch (method) {
        case "display":
            const displayValue = el.style.display;
            el.style.setProperty("display", "block", "important");
            return displayValue;
        case "visibility":
            const visibilityValue = el.style.visibility;
            el.style.setProperty("visibility", "visible", "important");
            return visibilityValue;
        case "opacity":
            const opacityValue = el.style.opacity;
            el.style.setProperty("opacity", "1", "important");
            return opacityValue;
        case "hidden":
            const hiddenValue = el.hidden;
            el.hidden = false;
            return hiddenValue;
    }
}

function unhideEl(el, method, originalValue) {
    switch (method) {
        case "display":
            if (originalValue) {
                el.style.setProperty("display", originalValue, "important");
            } else {
                el.style.removeProperty("display");
            }
            break;
        case "visibility":
            if (originalValue) {
                el.style.setProperty("visibility", originalValue, "important");
            } else {
                el.style.removeProperty("visibility");
            }
            break;
        case "opacity":
            if (originalValue) {
                el.style.setProperty("opacity", originalValue, "important");
            } else {
                el.style.removeProperty("opacity");
            }
            break;
        case "hidden":
            el.hidden = originalValue;
            break;
    }
}

function isWrappedWith(str, wrapperChar) {
    return typeof str === "string" && str.startsWith(wrapperChar) && str.endsWith(wrapperChar);
}

function unwrap(str, wrapperChar) {
    if (isWrappedWith(str, wrapperChar)) {
        return str.slice(1, -1);
    }
    return str;
}

// #endregion

// #region ==================== UTILS

function qs(query, parent) {
    if (query instanceof HTMLElement) return query;
    if (parent === undefined) {
        parent = document;
    }
    if (typeof parent == "string") {
        parent = qs(parent);
    }
    if (parent === null) {
        return null;
    }
    return parent.querySelector(query);
}

// sahibinden.com overrides window.console methods (anti-debugging); grab an untouched
// console from a throwaway same-origin iframe realm so logging actually shows up.
function getCleanConsole() {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    return iframe.contentWindow.console;
}

function qsa(query, parent) {
    if (query instanceof HTMLElement) return query;
    if (parent === undefined) {
        parent = document;
    }
    if (typeof parent == "string") {
        parent = qs(parent);
    }
    if (parent === null) {
        return [];
    }
    return Array.from(parent.querySelectorAll(query));
}

function unquote(str) {
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        return str.slice(1, -1);
    }
    return str;
}

function elsToText(els, separator = " ") {
    if (Array.isArray(els)) {
        return els.map((el) => el.innerText.trim()).join(separator);
    } else if (els instanceof Element) {
        return els.innerText.trim();
    } else if (typeof els === "string") {
        return els.trim();
    }
}

function removeRedundantLineBreaks(str) {
    if (typeof str !== "string") {
        return str;
    }
    return str.replace(/\n{3,}/g, "\n\n");
}

function nextElementSiblings(el) {
    if (!el) return [];
    let siblings = [];
    let next = el.nextElementSibling;
    while (next) {
        siblings.push(next);
        next = next.nextElementSibling;
    }
    return siblings;
}

async function copyToClipboard(text) {
    try {
        copy(text);
    } catch (error) {
        try {
            await copyToClipboardViaNavigator(text);
        } catch (error) {
            copyToClipboardViaCmd(text);
        }
    }
}

async function copyToClipboardViaNavigator(text) {
    await navigator.clipboard.writeText(text);
}

function copyToClipboardViaCmd(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

function createThumb(image, maxWidth, maxHeight) {
    const canvas = document.createElement("canvas");
    let [w, h] = [image.naturalWidth, image.naturalHeight];
    if (w > maxWidth) {
        h = (maxWidth / w) * h;
        w = maxWidth;
    }
    if (h > maxHeight) {
        w = (maxHeight / h) * w;
        h = maxHeight;
    }
    Object.assign(canvas, { width: w, height: h });
    canvas.getContext("2d").drawImage(image, 0, 0, w, h);
    return canvas.toDataURL("image/png");
}

async function img2b64(img, srcGetter = null, maxWidth = 200, maxHeight = 200) {
    const src = srcGetter ? srcGetter(img) : img.src;
    const makeResult = (image) => ({
        url: src,
        width: image.naturalWidth,
        height: image.naturalHeight,
        thumb: createThumb(image, maxWidth, maxHeight),
    });
    try {
        return makeResult(img);
    } catch (error) {
        // console.log("createThumb failed");
        // Cross-origin image with a tainted canvas; the host doesn't send CORS headers so a fetch retry
        // would also fail (and spam the console), so just skip the thumbnail and keep the dimensions we can read.
        return {
            url: src,
            width: img.naturalWidth || null,
            height: img.naturalHeight || null,
            thumb: null,
        };
    }
}

async function imgs2b64(imgs, srcGetter = null, maxWidth = 200, maxHeight = 200) {
    const results = await Promise.allSettled(imgs.map((img) => img2b64(img, srcGetter, maxWidth, maxHeight)));
    return results.map((result, i) => {
        if (result.status === "fulfilled") {
            return result.value;
        }
        const src = srcGetter ? srcGetter(imgs[i]) : imgs[i].src;
        return { url: src, width: null, height: null, thumb: null };
    });
}

function latinize(str) {
    const charMap = {
        Ç: "C",
        ç: "c",
        Ğ: "G",
        ğ: "g",
        İ: "I",
        ı: "i",
        Ö: "O",
        ö: "o",
        Ş: "S",
        ş: "s",
        Ü: "U",
        ü: "u",
    };
    return str.replace(/[^A-Za-z0-9]/g, (char) => charMap[char] || char);
}

// #endregion

// #region ==================== SAHIBINDEN

function getCarPartStatus(partName) {
    if (elsToText(nextElementSiblings(getElementsByText("Lokal Boyalı Parçalar")[0])).includes(partName)) {
        return "Lokal Boyalı";
    }
    if (elsToText(nextElementSiblings(getElementsByText("Değişen Parçalar")[0])).includes(partName)) {
        return "Değişen";
    }
    if (elsToText(nextElementSiblings(getElementsByText("Boyalı Parçalar")[0])).includes(partName)) {
        return "Boyalı";
    }
    return "Orijinal";
}

// #endregion

// #region ==================== HELPERS

function isTextQuery(query) {
    return typeof query === "string" && query.startsWith("text=");
}

function getTextQueryValue(query) {
    return query.slice("text=".length);
}

function isJsQuery(query) {
    return typeof query === "string" && query.match(/\$\d*/);
}

function getJsQueryValue(query, els, elVarName = "els") {
    if (Array.isArray(els)) {
        query = query.replace(/\$(\d+)/g, (_, index) => {
            return `${elVarName}[${index}]`;
        });
        query = query.replace(/\$(?!\d+)/g, elVarName);
    } else if (els instanceof Element) {
        query = query.replace(/\$0/g, elVarName);
    }
    return query;
}

function stringifyElement(element) {
    let elType = typeof element;
    let scalarTypes = ["string", "boolean", "number"];
    let text = null;
    if (element instanceof HTMLImageElement) {
        text = element.src;
    } else if (element instanceof Element) {
        text = innerText(element);
    } else if (scalarTypes.includes(elType)) {
        text = element;
    } else {
        text = element;
    }
    if (typeof text === "string") {
        text = text?.trim();
        text = removeRedundantLineBreaks(text);
    }
    return text;
}

async function processPath(path) {
    if (typeof path == "string") {
        if (path.length === 0) {
            return null;
        }
        path = [path];
    }

    let isResultMultiple = false;
    let lastPathItem = path[path.length - 1];
    if (lastPathItem == "array") {
        isResultMultiple = true;
        path = path.slice(0, -1);
    }

    let els = []; // Element, string, null, [Element, Element, ...]
    let result = null; // string, null, [string, string, ...]

    for (let i = 0; i < path.length; i++) {
        let isChainBroken = i > 0 && (!els || (Array.isArray(els) && els.length === 0));
        if (isChainBroken) {
            break;
        }
        let pathItem = path[i];
        if (isTextQuery(pathItem)) {
            let textToFind = getTextQueryValue(pathItem);
            els = getElementsByText(textToFind, els[0] || undefined);
        } else if (isJsQuery(pathItem)) {
            let jsCode = getJsQueryValue(pathItem, els, "els");
            let evalResult;
            try {
                evalResult = eval(jsCode);
                if (evalResult && typeof evalResult.then === "function") {
                    evalResult = await evalResult;
                }
            } catch (error) {
                console.error("Error evaluating:", jsCode, error);
                evalResult = null;
            }
            if (evalResult) {
                let isNonDom =
                    (jsCode.includes("::before") || jsCode.includes("::after")) && jsCode.includes(".content");
                if (isNonDom) {
                    evalResult = unquote(evalResult);
                }
            }
            els = evalResult;
        } else if (typeof pathItem === "string") {
            els = qsa(pathItem, els[0] || undefined);
        }
    }
    if (Array.isArray(els)) {
        result = els.map(stringifyElement).filter(Boolean);
    } else {
        result = stringifyElement(els);
    }
    if (Array.isArray(result) && !isResultMultiple) {
        result = result[0];
    }

    return result;
}

async function processesMapping(fieldsAndPaths) {
    let info = {};
    for (let field in fieldsAndPaths) {
        let pathOrMapping = fieldsAndPaths[field];
        let value = null;
        if (typeof pathOrMapping === "string" || Array.isArray(pathOrMapping)) {
            value = await processPath(pathOrMapping);
        } else if (typeof pathOrMapping === "function") {
            value = await pathOrMapping();
        } else if (typeof pathOrMapping === "object") {
            value = await processesMapping(pathOrMapping);
        }
        info[field] = value || null;
    }
    return info;
}

// #endregion

// #region ==================== SHEETS-MAIN

const sheetsConsole = getCleanConsole();
sheetsConsole.clear();

const sheetFieldsAndPaths = {
    title: "h1",
    price: ".classifiedPriceValue",
    location: ".classifiedLocation",
    listingId: ["text=İlan No", "$0.nextElementSibling"],
    listingDate: ["text=İlan Tarihi", "$0.nextElementSibling"],
    series: ["text=Seri", "$0.nextElementSibling"],
    model: ["text=Model", "$0.nextElementSibling"],
    year: ["text=Yıl", "$0.nextElementSibling"],
    fuelType: ["text=Yakıt / Motor Tipi", "$0.nextElementSibling"],
    transmission: ["text=Vites", "$0.nextElementSibling"],
    mileage: ["text=KM", "$0.nextElementSibling"],
    color: ["text=Renk", "$0.nextElementSibling"],
    lister: ["text=Kimden", "$0.nextElementSibling"],
    storeName: ".user-info-store-name a",
    storeAgentName: ".user-info-agent h3",
    storeAgentPhone: [".user-info-phones", "text=Cep", "$0.nextElementSibling"],
    username: [".username-info-area span", `getComputedStyle($0, "::before").content`],
    userPhone: [".pretty-phone-part span", "$0.dataset.content"],
    parts: {
        frontBumper: getCarPartStatus.bind(null, ["Ön Tampon"]),
        frontHood: getCarPartStatus.bind(null, ["Motor Kaputu"]),
        roof: getCarPartStatus.bind(null, ["Tavan"]),
        rearHood: getCarPartStatus.bind(null, ["Bagaj Kapağı"]),
        rearBumper: getCarPartStatus.bind(null, ["Arka Tampon"]),
        frontLeftFender: getCarPartStatus.bind(null, ["Sol Ön Çamurluk"]),
        frontLeftDoor: getCarPartStatus.bind(null, ["Sol Ön Kapı"]),
        rearLeftDoor: getCarPartStatus.bind(null, ["Sol Arka Kapı"]),
        rearLeftFender: getCarPartStatus.bind(null, ["Sol Arka Çamurluk"]),
        frontRightFender: getCarPartStatus.bind(null, ["Sağ Ön Çamurluk"]),
        frontRightDoor: getCarPartStatus.bind(null, ["Sağ Ön Kapı"]),
        rearRightDoor: getCarPartStatus.bind(null, ["Sağ Arka Kapı"]),
        rearRightFender: getCarPartStatus.bind(null, ["Sağ Arka Çamurluk"]),
    },
};

function sheetText(value) {
    return typeof value === "string" && value.trim() ? value.trim() : "-";
}

function sheetDate(value) {
    if (!value) return "-";
    const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoDate) return value;

    const months = {
        ocak: "01", subat: "02", mart: "03", nisan: "04", mayis: "05", haziran: "06",
        temmuz: "07", agustos: "08", eylul: "09", ekim: "10", kasim: "11", aralik: "12",
    };
    const match = value.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/i);
    if (!match) return value;

    const month = latinize(match[2].toLowerCase());
    return months[month]
        ? `${match[3]}-${months[month]}-${match[1].padStart(2, "0")}`
        : value;
}

function sheetNumber(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits ? Number(digits) : null;
}

function sheetPrice(value) {
    const amount = sheetNumber(value);
    return amount === null ? "-" : `₺${new Intl.NumberFormat("en-US").format(amount)}`;
}

function sheetMileage(value) {
    const mileage = sheetNumber(value);
    return mileage === null ? "-" : new Intl.NumberFormat("en-US").format(mileage);
}

function sheetPhone(value) {
    if (!value) return "-";
    let digits = value.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("90")) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
    return digits.length === 10
        ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
        : value.trim();
}

function sheetCell(value) {
    const text = String(value ?? "");
    return /[\t\r\n"]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

(async () => {
    const info = await processesMapping(sheetFieldsAndPaths);
    const location = sheetText(info.location).split("/").map((part) => part.trim());
    const isDealer = /galeri/i.test(info.lister || "");
    const seller = isDealer
        ? [info.storeName, info.storeAgentName].filter(Boolean).join("\n")
        : info.username;
    const phone = isDealer ? info.storeAgentPhone || info.userPhone : info.userPhone || info.storeAgentPhone;
    const parts = Object.entries(info.parts || {});
    const partLabels = {
        frontBumper: "Ön Tampon",
        frontHood: "Motor Kaputu",
        roof: "Tavan",
        rearHood: "Bagaj Kapağı",
        rearBumper: "Arka Tampon",
        frontLeftFender: "Sol Ön Çamurluk",
        frontLeftDoor: "Sol Ön Kapı",
        rearLeftDoor: "Sol Arka Kapı",
        rearLeftFender: "Sol Arka Çamurluk",
        frontRightFender: "Sağ Ön Çamurluk",
        frontRightDoor: "Sağ Ön Kapı",
        rearRightDoor: "Sağ Arka Kapı",
        rearRightFender: "Sağ Arka Çamurluk",
    };
    const partNames = (status) => {
        const matching = parts
            .filter(([, partStatus]) => partStatus === status)
            .map(([key]) => partLabels[key]);
        return matching.length ? matching.join(", ") : "-";
    };
    const lister = isDealer ? "galeri" : /sahip/i.test(info.lister || "") ? "sahibinden" : sheetText(info.lister);
    const fuelType = info.fuelType === "Benzinli" ? "Benzin" : sheetText(info.fuelType);
    const row = [
        sheetText(info.listingId),
        sheetText(info.title),
        location[1] || "-",
        (location[2] || "-").replace(/\s*(?:Mh\.?|Mah\.?|Mahallesi)\s*$/i, "").trim(),
        sheetDate(info.listingDate),
        "",
        sheetPrice(info.price),
        "-",
        "-",
        "",
        lister,
        sheetText(seller),
        sheetPhone(phone),
        sheetText(info.series),
        sheetText(info.model),
        sheetText(info.year),
        fuelType,
        sheetText(info.transmission),
        sheetMileage(info.mileage),
        sheetText(info.color),
        "",
        partNames("Değişen"),
        partNames("Boyalı"),
        partNames("Lokal Boyalı"),
    ];
    const output = row.map(sheetCell).join("\t");

    sheetsConsole.log(output);
    await copyToClipboard(output);
    sheetsConsole.log("Copied one spreadsheet row to clipboard.");
})();

// #endregion