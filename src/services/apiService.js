// src/services/apiService.js

import axios from 'axios';
import path from 'path';
import tokens from '@/tokens.js';

// Базовая функция для выполнения запросов к API WB
const makeApiRequest = async (url, method = 'GET', tokenKey, data = null) => {
    const token = tokens[tokenKey];

    const config = {
        method,
        url,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        data,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при запросе ${url}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

// Функция для сохранения данных в файл
const saveDataToFile = (fileName, data) => {
    const filePath = path.resolve('data', fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Функция для чтения данных из файла
const readDataFromFile = (fileName) => {
    const filePath = path.resolve('data', fileName);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return null;
};

// Примеры функций для работы с различными эндпоинтами WB

// Получение данных контента:
export const getContentData = async () => {
    const url = 'https://content-api.wildberries.ru/content/v2/cards/upload';
    const data = await makeApiRequest(url, 'POST', 'contentApiToken');
    saveDataToFile('contentData.json', data);  // Сохранение данных в файл
    return data;
};

// Получение данных из файла для использования в приложении
export const getCachedContentData = () => readDataFromFile('contentData.json');
export const getCachedPricesData = () => readDataFromFile('pricesData.json');
