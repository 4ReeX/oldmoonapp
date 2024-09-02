// src/stores/useDataStore.js

import {defineStore} from 'pinia';
import {getContentData, getPricesData} from '@/services/apiService';

export const useDataStore = defineStore('data', {
    state: () => ({
        contentData: [],
        pricesData: {}
    }),
    actions: {
        async fetchContentData() {
            try {
                this.contentData = await getContentData();
            } catch (error) {
                console.error('Ошибка загрузки данных о продажах:', error);
            }
        },
        async fetchPricesData() {
            try {
                const pricesData = await getPricesData();
            } catch (error) {
                console.error(`Ошибка загрузки данных о продукте:`, error);
            }
        }
    }
});
