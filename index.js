const {BrowserWindow, app} = require("electron");
const pie = require("puppeteer-in-electron")
const puppeteer = require("puppeteer-core");

const USERNAME = 'admin';
const PASSWORD = 'admin';
const URL = "http://10.10.100.254/";
const MENU_FRAME_URL = 'http://10.10.100.254/EN/treeappEN.html';
const AP_SETTINGS_FRAME = 'http://10.10.100.254/EN/ap.html';

const headers = new Map();
headers.set(
  'Authorization',
  `Basic ${new Buffer(`${USERNAME}:${PASSWORD}`).toString('base64')}`
);


const functionWithDelay = (time) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time)
  })
  return promise;
};


const main = async () => {
  await pie.initialize(app);
  const browser = await pie.connect(app, puppeteer);

  const window = new BrowserWindow();
  await window.loadURL(URL);

  const page = await pie.getPage(browser, window);
  await page.authenticate({ username: USERNAME, password: PASSWORD });
  
  await page.goto(URL);

  // Select left menu
  const menuFrame = await page.frames().find(frame => frame?._url === MENU_FRAME_URL);
  // Select AP Interface Setting
  const apInterfaceSettingsButton = await menuFrame.$('#ovAPCONFIG');

  await functionWithDelay(1000);
  await apInterfaceSettingsButton.click();
  await functionWithDelay(1000);
  

  const apSettingsFrame = await page.frames().find(frame => frame?._url === AP_SETTINGS_FRAME);
  const ssidInput = await apSettingsFrame.$('#MT_ssid');

  await functionWithDelay(1000);
  await ssidInput.click({ clickCount: 3 })
  await functionWithDelay(200);
  await ssidInput.type('usr-w610');
  
};


main();
