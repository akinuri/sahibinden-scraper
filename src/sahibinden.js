function getCarPartStatus(partName) {
    if (elsToText(nextElementSiblings(getElementsByText("Lokal Boyalı Parçalar")[0])).includes(partName)) {
        return "Lokal Boyalı";
    }
    if (elsToText(nextElementSiblings(getElementsByText("Değişen Parçalar")[0])).includes(partName)) {
        return "Değişen";
    }
    if (elsToText(nextElementSiblings(getElementsByText("Boyalı Parçalar")[0])).includes(partName)) {
        return "Boyalı";
    }
    return "Orijinal";
}
