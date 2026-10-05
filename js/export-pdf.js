const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { PDFDocument } = require('pdf-lib');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    // Como este script está en /js, subimos un nivel a la raíz del proyecto
    const projectRoot = path.resolve(__dirname, '..');
    const outputDir = path.join(projectRoot, 'output');
    const presentationPath = path.join(projectRoot, 'index.html');

    fs.mkdirSync(outputDir, { recursive: true });

    console.log(`Buscando presentación en: ${presentationPath}`);

    if (!fs.existsSync(presentationPath)) {
        console.error(`ERROR: No se encontró el archivo index.html en ${presentationPath}`);
        process.exit(1);
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

    console.log('Abriendo presentación...');

    await page.goto(pathToFileURL(presentationPath).href, {
        waitUntil: 'domcontentloaded',
        timeout: 0
    });

    await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images, image => {
            if (image.complete) return Promise.resolve();
            return new Promise(resolve => {
                image.addEventListener('load', resolve, { once: true });
                image.addEventListener('error', resolve, { once: true });
            });
        }));
    });

    const totalSlides = await page.evaluate(() => {
        window.ALL_SLIDES = Array.from(document.querySelectorAll('.slide, section'));
        return window.ALL_SLIDES.length;
    });

    console.log(`TOTAL SLIDES DETECTADAS: ${totalSlides}`);

    const imagePaths = [];

    for (let i = 0; i < totalSlides; i++) {
        console.log(`Capturando slide ${i + 1} de ${totalSlides}`);

        await page.evaluate((index) => {
            const slides = window.ALL_SLIDES;
            slides.forEach((slide, idx) => {
                if (idx === index) {
                    slide.style.display = 'block';
                    slide.classList.add('active');
                } else {
                    slide.style.display = 'none';
                    slide.classList.remove('active');
                }
            });
        }, i);

        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await delay(800);

        const imagePath = path.join(outputDir, `slide-${String(i + 1).padStart(2, '0')}.png`);

        await page.screenshot({
            path: imagePath,
            fullPage: false
        });

        imagePaths.push(imagePath);
    }

    console.log('Generando archivo PDF...');

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
    const finalPdfPath = path.join(outputDir, 'HORSEBIT_PRESENTACION_COMPLETA.pdf');

    fs.writeFileSync(finalPdfPath, pdfBytes);

    console.log(`PDF generado con éxito en: ${finalPdfPath}`);

    await browser.close();
})();