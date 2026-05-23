let equipments = __EQUIPMENTS_DATA__;

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

scrape: {
    let modelEl = document.querySelector(".tech-main-title span");
    let modelName = modelEl ? modelEl.innerText.trim() : "Bilinmeyen Model";
    if (!equipments.models.includes(modelName)) {
        equipments.models.push(modelName);
    }
    equipments.models.sort();

    let equipmentsEl = document.querySelector("div.equipments");
    let rows = equipmentsEl.querySelectorAll("tr");
    let lastGroupName = null;
    for (const row of rows) {
        let labelCell = row.children[0];
        let isGroupLabel = !labelCell.classList.contains("equipmentDescription");

        if (isGroupLabel) {
            let groupName = labelCell.innerText.trim();
            if (!(groupName in equipments.equipments)) {
                equipments.equipments[groupName] = [];
            }
            lastGroupName = groupName;
        } else {
            if (lastGroupName) {
                let equipmentName = labelCell.innerText.trim();
                if (!equipments.equipments[lastGroupName].includes(equipmentName)) {
                    equipments.equipments[lastGroupName].push(equipmentName);
                }
            }
        }
    }

    for (let group in equipments.equipments) {
        equipments.equipments[group].sort((a, b) => {
            let latinA = latinize(a).toLowerCase();
            let latinB = latinize(b).toLowerCase();
            if (latinA < latinB) return -1;
            if (latinA > latinB) return 1;
            return 0;
        });
    }

    console.log(equipments);

    copy(JSON.stringify(equipments, null, 4));
}
