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

    // Get the list of options in the select element
    const selectOptions = await page.evaluate(() => {
        const options = [];
        const selectElement = document.querySelector('select[name="MaterialArchive__noTable__sbv__ViewType"]'); // Replace 'yourSelectName' with the actual name of the select element
        for (const option of selectElement.options) {
            options.push(option.value);
        }
        return options;
    });

    // Loop through each option, select it, and capture the HTML content of the updated webpage
    for (const optionValue of selectOptions) {
        // Select the option from the dropdown
        await page.select('select[name="MaterialArchive__noTable__sbv__ViewType"]', optionValue); // Replace 'yourSelectName' with the actual name of the select element

        // Wait for the page navigation to complete
        await page.waitForNavigation();

        // Capture the HTML content of the updated webpage
        const htmlContent = await page.content();

        // Save the captured HTML content to a file
        const fs = require('fs');
        fs.writeFileSync(`updated_website_with_option_${optionValue}.html`, htmlContent);

        console.log(`Website with selected option ${optionValue} updated and saved to updated_website_with_option_${optionValue}.html`);
    }

    // Close the browser
    await browser.close();
})();
