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

function isWrappedWith(str, wrapperChar) {
    return typeof str === "string" && str.startsWith(wrapperChar) && str.endsWith(wrapperChar);
}

function unwrap(str, wrapperChar) {
    if (isWrappedWith(str, wrapperChar)) {
        return str.slice(1, -1);
    }
    return str;
}

function getElementsByText(text, parent) {
    if (parent === undefined) {
        parent = document;
    }
    if (typeof parent == "string") {
        parent = qs(parent);
    }
    if (parent === null) {
        return [];
    }
    let elements = qsa("*", parent);
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
