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