import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

// Импортируем функции из apiService
import { fetchContentData, fetchPricesData } from './src/services/apiService.js';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/data/materials.json', (req, res) => {
    const filePath = path.resolve('data', 'materials.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка загрузки материалов' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/save-materials', (req, res) => {
    const filePath = path.resolve('data', 'materials.json');
    const materials = JSON.stringify(req.body, null, 2);
    fs.writeFile(filePath, materials, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Ошибка сохранения материалов' });
        }
        res.json({ success: true });
    });
});

// Маршрут для получения данных контента
app.get('/api/content-data', async (req, res) => {
    try {
        const contentData = await fetchContentData();
        res.json(contentData);
    } catch (error) {
        console.error('Ошибка при получении данных контента:', error);
        res.status(500).json({ error: 'Ошибка при получении данных контента' });
    }
});

// Маршрут для получения данных цен
app.get('/api/prices-data', async (req, res) => {
    try {
        const pricesData = await fetchPricesData();
        res.json(pricesData);
    } catch (error) {
        console.error('Ошибка при получении данных цен:', error);
        res.status(500).json({ error: 'Ошибка при получении данных цен' });
    }
});

// Сохранение данных контента в файл
app.post('/save-content-data', async (req, res) => {
    const filePath = path.resolve('data', 'contentData.json');
    try {
        const contentData = await fetchContentData();
        fs.writeFile(filePath, JSON.stringify(contentData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Ошибка при сохранении данных контента:', err);
                return res.status(500).json({ error: 'Ошибка при сохранении данных контента' });
            }
            res.json({ success: true });
        });
    } catch (error) {
        console.error('Ошибка при получении данных контента:', error);
        res.status(500).json({ error: 'Ошибка при получении данных контента' });
    }
});

// Сохранение данных цен в файл
app.post('/save-prices-data', async (req, res) => {
    const filePath = path.resolve('data', 'pricesData.json');
    try {
        const pricesData = await fetchPricesData();
        fs.writeFile(filePath, JSON.stringify(pricesData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Ошибка при сохранении данных цен:', err);
                return res.status(500).json({ error: 'Ошибка при сохранении данных цен' });
            }
            res.json({ success: true });
        });
    } catch (error) {
        console.error('Ошибка при получении данных цен:', error);
        res.status(500).json({ error: 'Ошибка при получении данных цен' });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
