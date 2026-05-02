let fieldsAndPaths = {
    title: ["h1"],
    images: [".classifiedDetailMainPhoto img", "$.map(img => img.dataset.src || img.src)", "array"],
    breadcrumb: [".search-result-bc .bc-item", "elsToText($, ' > ')"],
    price: ".classified-price-wrapper",
    location: ".classifiedInfo h2",
    listingId: ["text=İlan No", "$0.nextElementSibling"],
    listingDate: ["text=İlan Tarihi", "$0.nextElementSibling"],
    brand: ["text=Marka", "$2.nextElementSibling"],
    series: ["text=Seri", "$0.nextElementSibling"],
    model: ["text=Model", "$0.nextElementSibling"],
    year: ["text=Yıl", "$0.nextElementSibling"],
    fuelType: ["text=Yakıt Tipi", "$0.nextElementSibling"],
    transmission: ["text=Vites", "$0.nextElementSibling"],
    state: ["text=Araç Durumu", "$1.nextElementSibling"],
    mileage: ["text=KM", "$0.nextElementSibling"],
    bodyType: ["text=Kasa Tipi", "$0.nextElementSibling"],
    enginePower: ["text=Motor Gücü", "$0.nextElementSibling"],
    engineVolume: ["text=Motor Hacmi", "$0.nextElementSibling"],
    Çekiş: ["text=Çekiş", "$0.nextElementSibling"],
    color: ["text=Renk", "$0.nextElementSibling"],
    warranty: ["text=Garanti", "$0.nextElementSibling"],
    heavilyDamaged: ["text=Ağır Hasar Kayıtlı", "$0.nextElementSibling"],
    licencePlate: ["text=Plaka / Uyruk", "$0.nextElementSibling"],
    lister: ["text=Kimden", "$0.nextElementSibling"],
    trade: ["text=Takas", "$0.nextElementSibling"],
    username: [".username-info-area span", `getComputedStyle($0, "::before").content`],
    userRegistrationDate: ".userRegistrationDate span",
    userMobilePhone: [".pretty-phone-part span", `$0.dataset.content`],
    description: "#classified-detail .uiBoxContainer",
    damages: {
        locallyPainted: ["text=Lokal Boyalı Parçalar", "nextElementSiblings($0)", "array"],
        painted: ["text=Boyalı Parçalar", "nextElementSiblings($0)", "array"],
        changed: ["text=Değişen Parçalar", "nextElementSiblings($0)", "array"],
    },
    feats: {
        security: {
            abs: ["#classifiedProperties", "text=ABS", "$0.classList.contains('selected')"],
            distronic: ["#classifiedProperties", "text=Distronic", "$0.classList.contains('selected')"],
            passengerAirbag: [
                "#classifiedProperties",
                "text=Hava Yastığı (Yolcu)",
                "$0.classList.contains('selected')",
            ],
            centralLock: ["#classifiedProperties", "text=Merkezi Kilit", "$0.classList.contains('selected')"],
            armoredVehicle: ["#classifiedProperties", "text=Zırhlı Araç", "$0.classList.contains('selected')"],
            aeb: ["#classifiedProperties", "text=AEB", "$0.classList.contains('selected')"],
            esp_vsa: ["#classifiedProperties", "text=ESP / VSA", "$0.classList.contains('selected')"],
            immobilizer: ["#classifiedProperties", "text=Immobilizer", "$0.classList.contains('selected')"],
            laneKeepingAssist: [
                "#classifiedProperties",
                "text=Şerit Takip Sistemi",
                "$0.classList.contains('selected')",
            ],
            bas: ["#classifiedProperties", "text=BAS", "$0.classList.contains('selected')"],
            nightVision: ["#classifiedProperties", "text=Gece Görüş Sistemi", "$0.classList.contains('selected')"],
            isofix: ["#classifiedProperties", "text=Isofix", "$0.classList.contains('selected')"],
            hillStartAssist: [
                "#classifiedProperties",
                "text=Yokuş Kalkış Desteği",
                "$0.classList.contains('selected')",
            ],
            childLock: ["#classifiedProperties", "text=Çocuk Kilidi", "$0.classList.contains('selected')"],
            driverAirbag: ["#classifiedProperties", "text=Hava Yastığı (Sürücü)", "$0.classList.contains('selected')"],
            blindSpotWarning: [
                "#classifiedProperties",
                "text=Kör Nokta Uyarı Sistemi",
                "$0.classList.contains('selected')",
            ],
            fatigueDetection: [
                "#classifiedProperties",
                "text=Yorgunluk Tespit Sistemi",
                "$0.classList.contains('selected')",
            ],
        },
        interior: {
            acc: ["#classifiedProperties", "text=Adaptive Cruise Control", "$0.classList.contains('selected')"],
            functionalSteering: [
                "#classifiedProperties",
                "text=Fonksiyonel Direksiyon",
                "$0.classList.contains('selected')",
            ],
            hydraulicSteering: [
                "#classifiedProperties",
                "text=Hidrolik Direksiyon",
                "$0.classList.contains('selected')",
            ],
            memorySeats: ["#classifiedProperties", "text=Koltuklar (Hafızalı)", "$0.classList.contains('selected')"],
            autoDimmingRearviewMirror: [
                "#classifiedProperties",
                "text=Otm.Kararan Dikiz Aynası",
                "$0.classList.contains('selected')",
            ],
            startStop: ["#classifiedProperties", "text=Start / Stop", "$0.classList.contains('selected')"],
            keylessEntryAndStart: [
                "#classifiedProperties",
                "text=Anahtarsız Giriş ve Çalıştırma",
                "$0.classList.contains('selected')",
            ],
            rearViewCamera: ["#classifiedProperties", "text=Geri Görüş Kamerası", "$0.classList.contains('selected')"],
            heatedSteeringWheel: [
                "#classifiedProperties",
                "text=Isıtmalı Direksiyon",
                "$0.classList.contains('selected')",
            ],
            heatedSeats: ["#classifiedProperties", "text=Koltuklar (Isıtmalı)", "$0.classList.contains('selected')"],
            frontViewCamera: ["#classifiedProperties", "text=Ön Görüş Kamerası", "$0.classList.contains('selected')"],
            thirdRowSeats: ["#classifiedProperties", "text=Üçüncü Sıra Koltuklar", "$0.classList.contains('selected')"],
            leatherSeats: ["#classifiedProperties", "text=Deri Koltuk", "$0.classList.contains('selected')"],
            headUpDisplay: ["#classifiedProperties", "text=Head-up Display", "$0.classList.contains('selected')"],
            climateControl: ["#classifiedProperties", "text=Klima", "$0.classList.contains('selected')"],
            cooledSeats: ["#classifiedProperties", "text=Koltuklar (Soğutmalı)", "$0.classList.contains('selected')"],
            frontSeatArmrest: [
                "#classifiedProperties",
                "text=Ön Koltuk Kol Dayaması",
                "$0.classList.contains('selected')",
            ],
            tripComputer: ["#classifiedProperties", "text=Yol Bilgisayarı", "$0.classList.contains('selected')"],
            electricWindows: ["#classifiedProperties", "text=Elektrikli Camlar", "$0.classList.contains('selected')"],
            cruiseControl: ["#classifiedProperties", "text=Hız Sabitleme Sistemi", "$0.classList.contains('selected')"],
            electricSeats: [
                "#classifiedProperties",
                "text=Koltuklar (Elektrikli)",
                "$0.classList.contains('selected')",
            ],
            fabricSeats: ["#classifiedProperties", "text=Kumaş Koltuk", "$0.classList.contains('selected')"],
            cooledGloveBox: ["#classifiedProperties", "text=Soğutmalı Torpido", "$0.classList.contains('selected')"],
        },
        exterior: {
            footActivatedTrunk: [
                "#classifiedProperties",
                "text=Ayakla Açılan Bagaj Kapağı",
                "$0.classList.contains('selected')",
            ],
            heatedMirrors: ["#classifiedProperties", "text=Aynalar (Isıtmalı)", "$0.classList.contains('selected')"],
            parkAssist: ["#classifiedProperties", "text=Park Asistanı", "$0.classList.contains('selected')"],
            towHook: ["#classifiedProperties", "text=Römork Çeki Demiri", "$0.classList.contains('selected')"],
            hardtop: ["#classifiedProperties", "text=Hardtop", "$0.classList.contains('selected')"],
            memoryMirrors: ["#classifiedProperties", "text=Aynalar (Hafızalı)", "$0.classList.contains('selected')"],
            sunroof: ["#classifiedProperties", "text=Sunroof", "$0.classList.contains('selected')"],
            adaptiveHeadlights: ["#classifiedProperties", "text=Far (Adaptif)", "$0.classList.contains('selected')"],
            rearParkingSensors: [
                "#classifiedProperties",
                "text=Park Sensörü (Arka)",
                "$0.classList.contains('selected')",
            ],
            smartTrunk: ["#classifiedProperties", "text=Akıllı Bagaj Kapağı", "$0.classList.contains('selected')"],
            electricMirrors: [
                "#classifiedProperties",
                "text=Aynalar (Elektrikli)",
                "$0.classList.contains('selected')",
            ],
            frontParkingSensors: [
                "#classifiedProperties",
                "text=Park Sensörü (Ön)",
                "$0.classList.contains('selected')",
            ],
            panoramicSunroof: [
                "#classifiedProperties",
                "text=Panoramik Cam Tavan",
                "$0.classList.contains('selected')",
            ],
        },
        multimedia: {
            androidAuto: ["#classifiedProperties", "text=Android Auto", "$0.classList.contains('selected')"],
            appleCarPlay: ["#classifiedProperties", "text=Apple CarPlay", "$0.classList.contains('selected')"],
            bluetooth: ["#classifiedProperties", "text=Bluetooth", "$0.classList.contains('selected')"],
            usbAux: ["#classifiedProperties", "text=USB / AUX", "$0.classList.contains('selected')"],
        },
    },
    specs: {
        general: {
            modelYear: ["text=Model Üretim Yılı (İlk / Son)", "$0.nextElementSibling"],
            segment: ["text=Segmenti", "$0.nextElementSibling"],
            bodyType: ["text=Kasa Tipi / Kapı Sayısı", "$0.nextElementSibling"],
            engineType: ["text=Motor Tipi", "$0.nextElementSibling"],
            fuelConsumption: ["text=Yakıt Tüketimi (Şehir içi / Şehir dışı)", "$0.nextElementSibling"],
            enginePower: ["text=Motor Gücü", "$0.nextElementSibling"],
            transmission: ["text=Şanzıman / Çekiş", "$0.nextElementSibling"],
            acceleration: ["text=Hızlanma 0-100 km/saat", "$0.nextElementSibling"],
            topSpeed: ["text=Azami Sürat", "$0.nextElementSibling"],
            annualTax: ["text=/Toplam yıllık MTV \\(\\d+ model ve \\d+ cc\\)/", "$0.nextElementSibling"],
        },
        engine: {
            engineType: ["text=Motor Tipi", "$0.nextElementSibling"],
            engineCapacity: ["text=Motor Hacmi", "$0.nextElementSibling"],
            maxPower: ["text=Maksimum Güç", "$0.nextElementSibling"],
            maxTorque: ["text=Maksimum Tork", "$0.nextElementSibling"],
            acceleration: ["text=Hızlanma 0-100 km/saat", "$0.nextElementSibling"],
            topSpeed: ["text=Azami Sürat", "$0.nextElementSibling"],
        },
        fuelConsumption: {
            fuelType: ["text=Yakıt Tipi", "$0.nextElementSibling"],
            cityConsumption: ["text=Şehir içi (100 km'de)", "$0.nextElementSibling"],
            highwayConsumption: ["text=Şehir dışı (100 km'de)", "$0.nextElementSibling"],
            averageConsumption: ["text=Ortalama (100 km'de)", "$0.nextElementSibling"],
            fuelTankCapacity: ["text=Yakıt Depo Hacmi", "$0.nextElementSibling"],
        },
        dimensions: {
            seatingCapacity: ["text=Koltuk Sayısı", "$0.nextElementSibling"],
            length: ["text=Uzunluk", "$0.nextElementSibling"],
            width: ["text=Genişlik", "$0.nextElementSibling"],
            height: ["text=Yükseklik", "$0.nextElementSibling"],
            curbWeight: ["text=Net Ağırlık", "$0.nextElementSibling"],
            trunkCapacity: ["text=Bagaj Kapasitesi", "$0.nextElementSibling"],
            tireDimensions: ["text=Lastik Ölçüleri", "$0.nextElementSibling"],
        },
    },
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

function innerText(el) {
    let text = "";
    if (el instanceof Element) {
        text = el.textContent;
    } else if (typeof el === "string") {
        text = el;
    }
    text = text?.trim().replace(/\s+/g, " ");
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
    text = innerText(text);
    let hasPattern = isWrappedWith(text, "/");
    if (hasPattern) {
        text = unwrap(text, "/");
    }
    let textPattern = new RegExp("^" + text + "$", "i");
    for (let element of elements) {
        let elementText = innerText(element);
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
        if (typeof pathOrMapping === "string" || Array.isArray(pathOrMapping)) {
            info[field] = await processPath(pathOrMapping);
        } else if (typeof pathOrMapping === "object") {
            info[field] = await processesMapping(pathOrMapping);
        }
    }
    return info;
}

// #endregion

console.clear();

(async () => {
    let info = await processesMapping(fieldsAndPaths);
    let json = JSON.stringify(info, null, 4);

    await copyToClipboard(json);
    console.log(json);
})();
