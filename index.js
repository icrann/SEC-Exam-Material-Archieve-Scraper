const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.examinations.ie/exammaterialarchive/');
    await page.click('#MaterialArchive__noTable__cbv__AgreeCheck');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const selectElementIds = ['MaterialArchive__noTable__sbv__ViewType', 'MaterialArchive__noTable__sbv__YearSelect', 'MaterialArchive__noTable__sbv__ExaminationSelect', 'MaterialArchive__noTable__sbv__SubjectSelect'];

    async function getOptions(selectId) {
        console.log(`Getting options for ${selectId}`);
        return await page.evaluate((selectId) => {
            const selectElement = document.querySelector(`select[name="${selectId}"]`);
            return Array.from(selectElement.options).slice(2).map(option => option.value);
        }, selectId);
    }
    
    async function selectOption(selectId, optionValue) {
        console.log(`Selecting option ${optionValue} for ${selectId}`);
        try {
            await page.select(`select[name="${selectId}"]`, optionValue);
            await page.waitForNavigation();
        } catch (error) {
            console.error(`Failed to select option ${optionValue} from ${selectId}: ${error}`);
            return false;
        }
        return true;
    }

    const options1 = await getOptions(selectElementIds[0]);
    for (const option1 of options1) {
        if (!await selectOption(selectElementIds[0], option1)) continue;
        const options2 = await getOptions(selectElementIds[1]);
        for (const option2 of options2) {
            if (!await selectOption(selectElementIds[1], option2)) continue;
            const options3 = await getOptions(selectElementIds[2]);
            for (const option3 of options3) {
                if (!await selectOption(selectElementIds[2], option3)) continue;
                const options4 = await getOptions(selectElementIds[3]);
                for (const option4 of options4) {
                    if (!await selectOption(selectElementIds[3], option4)) continue;
                    const htmlContent = await page.content();
                    const fs = require('fs');
                    fs.writeFileSync(`pages/updated_website_with_${option1}_${option2}_${option3}_${option4}.html`, htmlContent);
                    console.log(`Website with selected options (${option1}, ${option2}, ${option3}, ${option4}) updated and saved to updated_website_with_${option1}_${option2}_${option3}_${option4}.html`);
                }
            }
        }
    }

    await browser.close();
})();