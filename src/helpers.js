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
