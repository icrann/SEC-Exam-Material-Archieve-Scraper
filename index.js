const puppeteer = require('puppeteer');

(async () => {
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://www.examinations.ie/exammaterialarchive/');

    // Check the checkbox by clicking it
    await page.click('#MaterialArchive__noTable__cbv__AgreeCheck'); // Replace 'yourCheckboxId' with the actual ID of the checkbox

    // Wait for some time to allow the website to update (adjust the duration as needed)
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds (5000 milliseconds)

    // Define an array of IDs of select elements to loop through
    const selectElementIds = ['MaterialArchive__noTable__sbv__ViewType', 'MaterialArchive__noTable__sbv__YearSelect', 'MaterialArchive__noTable__sbv__ExaminationSelect', 'MaterialArchive__noTable__sbv__SubjectSelect']; // Add the IDs of select elements you want to loop through

    // Function to select options from dynamically loaded select elements
    async function selectOptions(selectId) {
        // Get the list of options in the select element
        const options = await page.evaluate((selectId) => {
            const selectElement = document.querySelector(`select[name="${selectId}"]`);
            return Array.from(selectElement.options).slice(2).map(option => option.value); // Ignore the first two options
        }, selectId);

        // Loop through each option and select it
        for (const optionValue of options) {
            // Select the option from the dropdown
            await page.select(`select[name="${selectId}"]`, optionValue);

            // Wait for the page navigation to complete
            await page.waitForNavigation();

            // Capture the HTML content of the updated webpage
            const htmlContent = await page.content();

            // Save the captured HTML content to a file
            const fs = require('fs');
            fs.writeFileSync(`pages/updated_website_with_${selectId}_${optionValue}.html`, htmlContent);

            console.log(`Website with selected option from ${selectId} (${optionValue}) updated and saved to updated_website_with_${selectId}_${optionValue}.html`);
        }
    }

    // Loop through each select element ID
    for (const selectId of selectElementIds) {
        await selectOptions(selectId);
    }

    // Close the browser
    await browser.close();
})();