const puppeteer = require('puppeteer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {

    if (!fs.existsSync('./output')) {
        fs.mkdirSync('./output');
    }

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });

    const page = await browser.newPage();

    console.log('Abriendo presentaciÃ³n...');

    await page.goto(`file://${__dirname}/presentacion.html`, {
        waitUntil: 'domcontentloaded',
        timeout: 0
    });

    await delay(5000);

    // DETECTAR TODOS LOS POSIBLES TIPOS DE SLIDES
    const totalSlides = await page.evaluate(() => {

        const selectors = [
            '.slide',
            'section',
            '.swiper-slide',
            '.page',
            '.screen'
        ];

        let slides = [];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!slides.includes(el)) {
                    slides.push(el);
                }
            });
        });

        window.ALL_SLIDES = slides;

        return slides.length;
    });

    console.log(`TOTAL SLIDES DETECTADAS: ${totalSlides}`);

    const imagePaths = [];

    for (let i = 0; i < totalSlides; i++) {

        console.log(`Capturando slide ${i + 1}`);

        await page.evaluate((index) => {

            const slides = window.ALL_SLIDES;

            slides.forEach((slide, idx) => {

                slide.style.display = 'none';
                slide.style.visibility = 'hidden';
                slide.style.opacity = '0';

                if (idx === index) {

                    slide.style.display = 'flex';
                    slide.style.visibility = 'visible';
                    slide.style.opacity = '1';

                    slide.classList.add('active');

                    slide.scrollIntoView({
                        behavior: 'instant',
                        block: 'center'
                    });

                } else {

                    slide.classList.remove('active');

                }

            });

        }, i);

        await delay(2500);

        const imagePath = `./output/slide-${String(i + 1).padStart(2, '0')}.png`;

        await page.screenshot({
            path: imagePath,
            fullPage: false
        });

        imagePaths.push(imagePath);
    }

    console.log('Creando PDF final...');

    const pdfDoc = await PDFDocument.create();

    for (const imagePath of imagePaths) {

        const imageBytes = fs.readFileSync(imagePath);

        const pngImage = await pdfDoc.embedPng(imageBytes);

        const pdfPage = pdfDoc.addPage([1920, 1080]);

        pdfPage.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: 1920,
            height: 1080
        });

    }

    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync(
        './output/HORSEBIT_PRESENTACION_COMPLETA.pdf',
        pdfBytes
    );

    console.log('PDF COMPLETO GENERADO');

    await browser.close();

})();