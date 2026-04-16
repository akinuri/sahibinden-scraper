let fieldsAndPaths = {
    title: "h1",
    price: ".classified-price-wrapper",
    location: ".classifiedInfo h2",
};

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
    for (let element of elements) {
        if (element.innerText?.trim() === text) {
            candidates.push(element);
        }
    }
    if (candidates.length === 0) {
        return [];
    }
    candidates.sort((a, b) => a.children.length - b.children.length);
    const minChildren = candidates[0].children.length;
    return candidates.filter((element) => element.children.length === minChildren);
}

function processSelector(selector) {
    if (typeof selector === "string") {
        let element = qs(selector);
        if (element) {
            return element.innerText.trim();
        }
    }
    return null;
}

// #endregion

function scrape() {
    let info = {};
    for (let field in fieldsAndPaths) {
        let path = fieldsAndPaths[field];
        info[field] = processSelector(path);
    }
    return info;
}

let info = scrape();
let json = JSON.stringify(info, null, 4);

copy(json);
console.clear();
console.log(json);
