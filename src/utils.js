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
