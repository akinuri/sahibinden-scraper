console.clear();

(async () => {
    let swStart = performance.now();
    let info = await processesMapping(fieldsAndPaths);
    let json = JSON.stringify(info, null, 4);

    await copyToClipboard(json);
    console.log(json);
    let swEnd = performance.now();
    console.log(`Execution time: ${swEnd - swStart} ms`);
})();
