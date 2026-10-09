const sheetsConsole = getCleanConsole();
sheetsConsole.clear();

const sheetFieldsAndPaths = {
    title: "h1",
    price: ".classifiedPriceValue",
    location: ".classifiedLocation",
    storeName: ".user-info-store-name a, .storeBox .storeInfo",
    storeAgentName: ".user-info-agent h3, .username-info-area h5",
    storeAgentPhone: [".user-info-phones", "text=Cep", "$0.nextElementSibling"],
    username: [".username-info-area span", `getComputedStyle($0, "::before").content`],
    userPhone: [".pretty-phone-part span", "$0.dataset.content"],
    phoneText: ".pretty-phone-part",
};

function sheetInfoItems() {
    const items = {};
    for (const item of document.querySelectorAll(".classifiedInfoItem")) {
        const label = item.querySelector("dt")?.textContent.trim();
        if (label) items[label] = item.querySelector("dd")?.textContent.trim();
    }
    return items;
}

// textContent avoids the layout cost of innerText
function sheetSectionText(heading) {
    const el = [...document.querySelectorAll("*")].find((e) => e.textContent.trim() === heading);
    return nextElementSiblings(el).map((e) => e.textContent).join(" ");
}

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
    const price = String(value || "").replace(/\D/g, "");
    return price || "-";
}

function sheetMileage(value) {
    const mileage = String(value || "").replace(/\D/g, "");
    return mileage || "-";
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
    const items = sheetInfoItems();
    Object.assign(info, {
        listingId: items["İlan No"],
        listingDate: items["İlan Tarihi"],
        series: items["Seri"],
        model: items["Model"],
        year: items["Yıl"],
        fuelType: items["Yakıt / Motor Tipi"],
        transmission: items["Vites"],
        mileage: items["KM"],
        color: items["Renk"],
        lister: items["Kimden"],
    });
    const location = sheetText(info.location).split("/").map((part) => part.trim());
    const isDealer = /galeri/i.test(info.lister || "");
    const seller = isDealer
        ? [info.storeName, info.storeAgentName].filter(Boolean).join("\n")
        : info.username;
    const phone = (isDealer ? info.storeAgentPhone || info.userPhone : info.userPhone || info.storeAgentPhone) || info.phoneText;
    const partLabels = [
        "Ön Tampon", "Motor Kaputu", "Tavan", "Bagaj Kapağı", "Arka Tampon",
        "Sol Ön Çamurluk", "Sol Ön Kapı", "Sol Arka Kapı", "Sol Arka Çamurluk",
        "Sağ Ön Çamurluk", "Sağ Ön Kapı", "Sağ Arka Kapı", "Sağ Arka Çamurluk",
    ];
    // key order is the match priority
    const sections = {
        "Lokal Boyalı": sheetSectionText("Lokal Boyalı Parçalar"),
        "Değişen": sheetSectionText("Değişen Parçalar"),
        "Boyalı": sheetSectionText("Boyalı Parçalar"),
    };
    const partNames = (status) => {
        const matching = partLabels.filter(
            (label) => Object.keys(sections).find((key) => sections[key].includes(label)) === status,
        );
        return matching.length ? matching.join("\n") : "-";
    };
    const lister = isDealer ? "galeri" : /sahib/i.test(info.lister || "") ? "sahip" : sheetText(info.lister).toLowerCase();
    const fuelType = info.fuelType === "Benzinli" ? "Benzin" : sheetText(info.fuelType);
    const row = [
        sheetText(info.listingId),
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