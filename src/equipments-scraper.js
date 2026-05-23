let equipments = __EQUIPMENTS_DATA__;

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

    console.log(equipments);

    copy(JSON.stringify(equipments, null, 4));
}
