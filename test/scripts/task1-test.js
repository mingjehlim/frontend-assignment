const { By, Builder, Capabilities, until } = require('selenium-webdriver');
const { suite } = require('selenium-webdriver/testing');
const chrome = require('selenium-webdriver/chrome');
const assert = require("assert");
const { before, after } = require('mocha');

// Configurations
const serverUrl = "http://localhost:4444/wd/hub"; // Remote Selenium Hub URL to use. Comment to use local machine
const hostUrl = "http://abc:3000";                // Set target test site URL. Can be local or remote server/container
const APIToggleUrl = "http://abc:3000?status=";   // Set Backend API server toggle URL
const errorTextValue = "No data found";
const ON = "ON";
const OFF = "OFF";
let capabilities = Capabilities.chrome();

suite(function(env) {
    describe('Front end test cases', () => {
        let driver;

        before(async function() {
            let options = new chrome.Options();
            options.addArguments(
                "--ignore-ssl-errors=yes", 
                "--ignore-certificate-errors"
                // ,"--no-sandbox"
                // ,"--headless"
                );
            
            driver = await new Builder().forBrowser('chrome')
                    .usingServer(serverUrl) 
                    .withCapabilities(capabilities)
                    .setChromeOptions(options)
                    .build();
        });

        after(async () => {
            driver.quit();
        });

        it('Case 1 - 1. Book container border is 1px solid rgb(0, 0, 0)', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();
        
                await driver.get(hostUrl);
                await driver.wait(until.elementLocated(By.css('[id^="book-item-"]')), 3000);
        
                // get initial container dimension
                let container = await driver.findElement(By.id('container'));
                let containerBorder = await container.getCssValue('border');

                try {
                    // Assert
                    console.log(containerBorder);

                    assert.equal(containerBorder, "1px solid rgb(0, 0, 0)");
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 1 - 2. Book container width is 500px', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();
        
                await driver.get(hostUrl);
                await driver.wait(until.elementLocated(By.css('[id^="book-item-"]')), 3000);
        
                // get initial container dimension
                let container = await driver.findElement(By.id('container'));
                let containerWidth = await container.getCssValue('width');
        
                try {
                    // Assert
                    assert.equal(containerWidth, "500px");
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 1 - 3. Book container height < viewport height after expand', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();
                const { width, height } = await driver.manage().window().getRect();
        
                await driver.get(hostUrl);
                await driver.wait(until.elementLocated(By.css('[id^="book-item-"]')), 3000);
        
                // get initial container dimension
                let container = await driver.findElement(By.id('container'));
        
                // expand and get expanded container dimension
                let toggle = await container.findElement(By.className('book-toggle'));
                await toggle.click();
        
                let newContainer = await driver.findElement(By.id('container')).getRect();
                let newHeight =  await newContainer.height;

                try {
                    // Assert
                    assert(newHeight < height);
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 1 - 4. Book count is 3', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();
                
                await driver.get(hostUrl);
                await driver.wait(until.elementLocated(By.css('[id^="book-item-"]')), 3000);
            
                // get container and book items
                let container = await driver.findElement(By.id('container'));
                let bookItems = await container.findElements(By.css("[id^='book-item-']"));
                
                try {
                    // Assert
                    assert.equal(bookItems.length, 3); // only 3 books shown
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 1 - 5. Book element width and height is 409px x 108px', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();
            
                const { width, height } = await driver.manage().window().getRect();
                
                await driver.get(hostUrl);
                await driver.wait(until.elementLocated(By.css('[id^="book-item-"]')), 3000);
            
                // get container and book items
                let container = await driver.findElement(By.id('container'));
                let bookItems = await container.findElements(By.css("[id^='book-item-']"));
                
                try {
                    // Assert
                    for (let item of bookItems){
                        let height = await item.getCssValue('height');
                        let width = await item.getCssValue('width');
        
                        assert.equal(height, "108px");
                        assert.equal(width, "409px");
                    }
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 1 - 6. Only 1 book item can be expanded at once, with 3 childs max', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();
                
                await driver.get(hostUrl);
                await driver.wait(until.elementLocated(By.css('[id^="book-item-"]')), 3000);
            
                // get container and book items
                let container = await driver.findElement(By.id('container'));
                let bookItems = await container.findElements(By.css("[id^='book-item-']"));
                
                for (let item of bookItems){
                    let toggle = await item.findElement(By.css('.book-toggle'));
                    // click all toggles
                    await toggle.click();
                }

                let customers = await driver.findElements(By.className('customer'));               
                
                try {
                    // Assert
                    assert.equal(customers.length, 3); // only 3 customers shown at any time
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 1 - 7. Child width and height is 331px x 79px', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();
            
                await driver.get(hostUrl);
            
                // wait book items to be loaded
                await driver.wait(until.elementLocated(By.css('[id^="book-item-"]')), 3000);
                let toggle = await driver.findElement(By.css('.book-toggle'));

                // click a toggle
                await toggle.click();

                let customers = await driver.findElements(By.className('customer'));
                
                try {
                    // Assert
                    for (let cust of customers){
                        let height = await cust.getCssValue('height');
                        let width = await cust.getCssValue('width');
        
                        assert.equal(height, "79px");
                        assert.equal(width, "331px");
                    }
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 2 - 1. Refresh button text value contains "Get country: "', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();

                await driver.get(hostUrl);

                // get button
                let actionButton = await driver.findElement(By.id('action-btn'));
                let buttonText = await actionButton.getText();
                
                try {
                    // Assert
                    assert(buttonText.includes('Get country: '));
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 2 - 2. Refresh button Position from left and top is 25px', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();

                await driver.get(hostUrl);

                // get button
                let actionButton = await driver.findElement(By.id('action-btn'));
                let left = await actionButton.getCssValue('left');
                let top = await actionButton.getCssValue('top');
                
                try {
                    // Assert
                    assert.equal(left, '25px');
                    assert.equal(top, '25px');
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 2 - 3. Refresh button calls 2 APIs on click and render new data', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();

                await driver.get(hostUrl);

                // get button
                let actionButton = await driver.findElement(By.id('action-btn'));
                
                try {
                    // Assert
                    // Simulate click refresh button and wait until items rendered
                    await actionButton.click();
                    await driver.wait(until.elementLocated(By.className('book-item-detail')), 3000);
    
                    let bookItems = await driver.findElements(By.css("[id^='book-item-']"));
                    assert.equal(await bookItems.length, 3); // only 3 books shown 
    
                    // click first book toggle
                    let toggle = await driver.findElement(By.css('.book-toggle'));
                    await toggle.click();
    
                    let customers = await driver.findElements(By.className('customer'));
                    assert.equal(await customers.length, 3); // only 3 customers shown at any time
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }

                return resolve();
            });
        });

        it('Case 3 - 1. Error message is displayed if API returns no data or has error', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();

                // Call to turn off API server
                await driver.get(APIToggleUrl + OFF);
                await driver.get(hostUrl);
                await driver.wait(until.elementLocated(By.id('error-message')), 3000);

                // get error message element
                let errorMessage = await driver.findElement(By.id('error-message'));
                let display = await errorMessage.isDisplayed();

                try {
                    // Assert
                    assert.equal(display, true);
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }
                finally {
                    // Call to turn on API server
                    await driver.get(APIToggleUrl + ON);
                }

                return resolve();
            });
        });

        it('Case 3 - 2. Error message text value is "No data found"', async function() {
            return new Promise(async function(resolve, reject) {
                // Maximize window
                await driver.manage().window().maximize();

                // Call to turn off API server
                await driver.get(APIToggleUrl + OFF);
                await driver.get(hostUrl);
                await driver.wait(until.elementLocated(By.id('error-message')), 3000);

                // get error message element
                let errorMessage = await driver.findElement(By.id('error-message'));
                let errorText = await errorMessage.getAttribute("innerText"); // Alternative to .getText()

                try {
                    // Assert
                    assert.equal(errorText, errorTextValue);
                }
                catch(e) {
                    console.log(e);
                    return reject();
                }
                finally {
                    // Call to turn on API server
                    await driver.get(APIToggleUrl + ON);
                }

                return resolve();
            });
        });
    });
});