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
