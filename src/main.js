const console = getCleanConsole();

console.clear();

(async () => {
    console.log("Starting scraper...");
    let swStart = performance.now();
    let info = await processesMapping(fieldsAndPaths);
    console.log("Stringifying ...");
    let json = JSON.stringify(info, null, 4);

    console.log(json);
    await copyToClipboard(json);
    console.log("Copied to clipboard.");
    let swEnd = performance.now();
    console.log(`Execution time: ${swEnd - swStart} ms`);
})();
