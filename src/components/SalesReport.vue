<!-- SalesReport.vue -->
<template>
  <div class="sales-report">
    <!-- Дата начала -->
    <div class="date-picker">
      <label for="start-date">Начальная дата:</label>
      <input type="datetime-local" id="start-date" v-model="period.start" />
    </div>

    <!-- Дата окончания -->
    <div class="date-picker">
      <label for="end-date">Конечная дата:</label>
      <input type="datetime-local" id="end-date" v-model="period.end" />
    </div>

    <!-- Кнопка запроса -->
    <ButtonFetchReport @click="fetchReport">Запросить отчет</ButtonFetchReport>

    <!-- Вкладки -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'json' }" @click="activeTab = 'json'">JSON</button>
      <button :class="{ active: activeTab === 'table' }" @click="activeTab = 'table'">Таблица</button>
    </div>

    <!-- Контент вкладок -->
    <div v-if="activeTab === 'json'" class="tab-content">
      <h3>JSON данные:</h3>
      <pre>{{ formattedReportData }}</pre>
    </div>
    <div v-if="activeTab === 'table'" class="tab-content">
      <h3>Таблица данных:</h3>
      <table>
        <thead>
        <tr>
          <th @click="sortTable('nmID')">ID</th>
          <th @click="sortTable('vendorCode')">Код</th>
          <th @click="sortTable('productName')">Название товара</th>
          <th @click="sortTable('brandName')">Бренд</th>
          <th @click="sortTable('object.name')">Объект</th>
          <th @click="sortTable('stocks.stocksWb')">Остаток шт.</th>
          <th @click="sortTable('statistics.selectedPeriod.openCardCount')">Заходов на товар</th>
          <th @click="sortTable('statistics.selectedPeriod.ordersSumRub')">Сумма заказов (руб)</th>
          <th @click="sortTable('statistics.selectedPeriod.avgPriceRub')">Средняя цена (руб)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in sortedData" :key="item.nmID">
          <td>{{ item.nmID }}</td>
          <td>{{ item.vendorCode }}</td>
          <td>{{ getProductName(item.vendorCode) }}</td>
          <td>{{ item.brandName }}</td>
          <td>{{ item.object.name }}</td>
          <td>{{ item.stocks.stocksWb }}</td>
          <td>{{ item.statistics.selectedPeriod.openCardCount }}</td>
          <td>{{ item.statistics.selectedPeriod.ordersSumRub }}</td>
          <td>{{ item.statistics.selectedPeriod.avgPriceRub }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { tokens } from '@/tokens.js';
import ButtonFetchReport from './ButtonFetchReport.vue';

export default {
  components: {
    ButtonFetchReport
  },
  data() {
    return {
      reportData: null,
      brandNames: [],
      objectIDs: [],
      tagIDs: [],
      nmIDs: [],
      timezone: 'Europe/Moscow',
      period: {
        start: this.formatDate(new Date(new Date().setMonth(new Date().getMonth() - 3)), true),
        end: this.formatDate(new Date(), true)
      },
      page: 1,
      sortKey: '',
      sortOrder: 1,
      activeTab: 'table', // По умолчанию отображается вкладка "Таблица"
      productNames: {
        '1': 'Браслет из граната кубик',
        '3': 'локомотив РК серебро',
        '4': 'Браслет из р.к. Клевер Золотой',
        '8': 'локомотив РК золото',
        '9': 'Браслет из лунного камня',
        '11': 'Браслет из черного агата с сердцем',
        '12': 'Браслет из черного агата с сердцем перл',
        '13': 'локомотив РК перламутр',
        '16': 'ЧА Паучок',
        '17': 'Браслет из РК Клевер серебро',
        '20': 'Чокер Гранат',
        '21': 'Серьги сердца золотые',
        '22': 'Серьги комплект белый/розовый',
        '23': 'Браслет из белого агата с сердцем',
        '24': 'Браслет из лунного камня обычный',
        '25': 'Серьги конго трансформеры белые',
        '26': 'Серьги конго трансформеры черные',
        '27': 'Серьги конго трансформеры голубые',
        '28': 'Чокер Гематит',
        '29': 'Мужской браслет из натуральных камней волк',
        '30': 'Чокер розовый кварц'
      }
    };
  },
  computed: {
    sortedData() {
      if (!this.reportData || !this.reportData.data || !this.reportData.data.cards) return [];

      let data = this.reportData.data.cards;

      if (this.sortKey) {
        data = data.slice().sort((a, b) => {
          const aValue = this.getNestedValue(a, this.sortKey);
          const bValue = this.getNestedValue(b, this.sortKey);

          if (typeof aValue === 'string' && isNaN(aValue)) {
            return this.sortOrder * aValue.localeCompare(bValue);
          }
          return this.sortOrder * (aValue - bValue);
        });
      }

      return data;
    },
    formattedReportData() {
      return JSON.stringify(this.reportData, null, 2); // Форматируем JSON для отображения
    }
  },
  methods: {
    formatDate(date, includeTime = false) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return includeTime
          ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
          : `${year}-${month}-${day}`;
    },

    async fetchReport() {
      const url = 'https://seller-analytics-api.wildberries.ru/api/v2/nm-report/detail';

      try {
        const response = await axios.post(
            url,
            {
              brandNames: this.brandNames,
              objectIDs: this.objectIDs,
              tagIDs: this.tagIDs,
              nmIDs: this.nmIDs,
              timezone: this.timezone,
              period: {
                begin: this.period.start,
                end: this.period.end
              },
              page: this.page
            },
            {
              headers: {
                'Authorization': `Bearer ${tokens.analytics}`,
                'Content-Type': 'application/json'
              }
            }
        );

        this.reportData = response.data;
      } catch (error) {
        console.error('Error fetching report:', error.response ? error.response.data : error.message);
      }
    },

    sortTable(key) {
      this.sortKey = key;
      this.sortOrder = this.sortKey === key ? -this.sortOrder : 1;
    },

    getNestedValue(obj, key) {
      return key.split('.').reduce((acc, part) => acc && acc[part], obj);
    },

    getProductName(vendorCode) {
      return this.productNames[vendorCode] || 'Неизвестно';
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/_variables.scss';
@import '@/styles/_typography.scss';
@import '@/styles/_buttons.scss';

.sales-report {
  .date-picker {
    margin-bottom: 20px;

    label {
      margin-right: 10px;
      font-size: 16px;
    }

    input[type="datetime-local"] {
      padding: 10px;
      border: 1px solid $secondary-color;
      border-radius: 4px;
      font-size: 16px;
      width: 200px;
    }
  }

  .tabs {
    margin-top: 20px;
    margin-bottom: 20px;

    button {
      @include button-base($primary-color, $light-color); // Используем стили для кнопок из _typography.scss
      margin-right: 10px;

      &.active {
        @include button-active;
      }
    }
  }

  .tab-content {
    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 10px;
        border: 1px solid $secondary-color;
        text-align: right;
      }

      th {
        cursor: pointer;
        background-color: $light-color;
      }

      th.sort-asc::after {
        content: '▲';
      }

      th.sort-desc::after {
        content: '▼';
      }
    }
  }
}
</style>
