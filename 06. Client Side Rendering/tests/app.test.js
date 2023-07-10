let { chromium } = require('playwright-chromium');
let expect = require('chai').expect;

let browser;
let page;

describe('E2E Tests', function () {
    before(async () => {
        // browser = await chromium.launch();
        browser = await chromium.launch({ headless: false, slowMo: 1000 });
    });
    after(async () => { await browser.close(); });
    beforeEach(async () => { page = await browser.newPage(); });
    afterEach(async () => { await page.close(); });

    describe('Catalog', function () {
        it('Should load recipes', async function () {
            let url = 'http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg';
            let recipes = [
                {
                    "name": "Easy Lasagna",
                    "img": "assets/lasagna.jpg",
                    "_id": "1"
                },
                {
                    "name": "Test2",
                    "img": "assets/roast.jpg",
                    "_id": "2"
                },
                {
                    "name": "Test 3",
                    "img": "assets/fish.jpg",
                    "_id": "3"
                },
            ]
            await page.route('**/data/recipes?select=_id%2Cname%2Cimg', route => route.fulfill(
                {
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(recipes)
                }
            ));

            await page.goto('http://localhost:5501');
            let titles = [];

            let elements = await page.locator('css=article.preview h2').all();
            for (const element of elements) {
                let text = await element.textContent();
                titles.push(text);
            }

            expect(titles.length).to.equal(3);
            expect(titles[0]).to.equal('Easy Lasagna');
            expect(titles[1]).to.equal('Test2');
            expect(titles[2]).to.equal('Test 3');
        })
    })

    describe('Login', function () {
        it('Should send correct data', async function () {
            let user = {
                accessToken: '1',
                email: 'test',
                username: 'user',
                _id: '1'
            };

            let username = undefined;
            let password = undefined;

            await page.route('**/users/login', (route, request) => {
                let postBody = JSON.parse(request.postData());
                username = postBody.email;
                password = postBody.password;

                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(user)
                });
            });

            await page.goto('http://localhost:5501');
            await page.click('text=Login');
            // await page.locator('text=Login').click();

            await page.fill('input[name="email"]', 'peter@abv.bg');
            await page.fill('input[name="password"]', '123456');

            await Promise.all([
                page.waitForResponse('**/users/login'),
                page.click('form >> text=Login')
            ]);

            expect(username).to.equal('peter@abv.bg');
            expect(password).to.equal('123456');
        })
    })
})