<template>
  <div class="materials-manager">
    <h2>Управление материалами и ценами</h2>

    <!-- Форма для добавления и редактирования материала -->
    <div class="form">
      <!-- Выбор товара для привязки материала -->
      <select v-model="newMaterial.vendorCode">
        <option disabled value="">Выберите товар</option>
        <option v-for="product in productList" :key="product.vendorCode" :value="product.vendorCode">
          {{ product.vendorCode }} - {{ product.productName }}
        </option>
      </select>
      <input type="text" v-model="newMaterial.name" placeholder="Название материала" />
      <input type="number" v-model="newMaterial.price" placeholder="Цена (руб.)" />
      <button @click="addOrUpdateMaterial">{{ editMode ? 'Обновить' : 'Добавить' }} материал</button>
    </div>

    <!-- Список материалов для выбранного товара -->
    <div v-if="selectedVendorCodeMaterials.length">
      <h3>Материалы для товара: {{ newMaterial.vendorCode }}</h3>
      <table>
        <thead>
        <tr>
          <th>Название материала</th>
          <th>Цена (руб.)</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(material, index) in selectedVendorCodeMaterials" :key="index">
          <td>{{ material.name }}</td>
          <td>{{ material.price }}</td>
          <td>
            <button @click="editMaterial(index)">Редактировать</button>
            <button @click="removeMaterial(index)">Удалить</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Для этого товара еще не добавлены материалы.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      materials: {}, // Объект, где ключами будут vendorCode, а значениями массивы материалов
      newMaterial: {
        name: '',
        price: null,
        vendorCode: ''
      },
      // список товаров, загруженный из таблицы
      productList: [
        {nmID: '1', vendorCode: '1', productName: 'Браслет из граната кубик'},
        {nmID: '3', vendorCode: '3', productName: 'локомотив РК серебро'},
        {nmID: '4', vendorCode: '4', productName: 'Браслет из р.к. Клевер Золотой'},
        {nmID: '8', vendorCode: '8', productName: 'локомотив РК золото'},
        {nmID: '9', vendorCode: '9', productName: 'Браслет из лунного камня'},
        {nmID: '11', vendorCode: '11', productName: 'Браслет из черного агата с сердцем'},
        {nmID: '12', vendorCode: '12', productName: 'Браслет из черного агата с сердцем перл'},
        {nmID: '13', vendorCode: '13', productName: 'локомотив РК перламутр'},
        {nmID: '16', vendorCode: '16', productName: 'ЧА Паучок'},
        {nmID: '17', vendorCode: '17', productName: 'Браслет из РК Клевер серебро'},
        {nmID: '20', vendorCode: '20', productName: 'Чокер Гранат'},
        {nmID: '21', vendorCode: '21', productName: 'Серьги сердца золотые'},
        {nmID: '22', vendorCode: '22', productName: 'Серьги комплект белый/розовый'},
        {nmID: '23', vendorCode: '23', productName: 'Браслет из белого агата с сердцем'},
        {nmID: '24', vendorCode: '24', productName: 'Браслет из лунного камня обычный'},
        {nmID: '25', vendorCode: '25', productName: 'Серьги конго трансформеры белые'},
        {nmID: '26', vendorCode: '26', productName: 'Серьги конго трансформеры черные'},
        {nmID: '27', vendorCode: '27', productName: 'Серьги конго трансформеры голубые'},
        {nmID: '28', vendorCode: '28', productName: 'Чокер Гематит'},
        {nmID: '29', vendorCode: '29', productName: 'Мужской браслет из натуральных камней волк'},
        {nmID: '30', vendorCode: '30', productName: 'Чокер розовый кварц'}
      ],
      editIndex: null,
      editMode: false
    };
  },
  computed: {
    // Получаем материалы для выбранного товара
    selectedVendorCodeMaterials() {
      return this.materials[this.newMaterial.vendorCode] || [];
    }
  },
  methods: {
    async addOrUpdateMaterial() {
      const {vendorCode, name, price} = this.newMaterial;

      if (!this.materials[vendorCode]) {
        this.materials[vendorCode] = [];
      }

      if (this.editMode) {
        this.materials[vendorCode][this.editIndex] = {name, price};
        this.editMode = false;
      } else {
        this.materials[vendorCode].push({name, price});
      }

      await this.saveMaterials();
      this.resetForm();
    },

    editMaterial(index) {
      const {name, price} = this.selectedVendorCodeMaterials[index];
      this.newMaterial = {name, price, vendorCode: this.newMaterial.vendorCode};
      this.editIndex = index;
      this.editMode = true;
    },

    async removeMaterial(index) {
      this.materials[this.newMaterial.vendorCode].splice(index, 1);
      await this.saveMaterials();
    },

    async loadMaterials() {
      try {
        const response = await fetch('/data/materials.json');
        if (response.ok) {
          this.materials = await response.json();
        }
      } catch (error) {
        console.error('Ошибка загрузки материалов:', error);
      }
    },

    async saveMaterials() {
      try {
        await fetch('/save-materials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.materials),
        });
      } catch (error) {
        console.error('Ошибка сохранения материалов:', error);
      }
    },

    resetForm() {
      this.newMaterial.name = '';
      this.newMaterial.price = null;
      this.editIndex = null;
      this.editMode = false;
    }
  },

  async mounted() {
    await this.loadMaterials();
  }
};
</script>

<style scoped>
/* Стилизация оставлена без изменений */
</style>
