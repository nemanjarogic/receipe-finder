import uniqid from 'uniqid';

export default class ShoppingList {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        this.items.push(item);
        this.persistData();

        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
        this.persistData();
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
        this.persistData();
    }

    persistData() {
        localStorage.setItem('shoppingList', JSON.stringify(this.items));
    }

    readDataFromStorage() {
        const storage = JSON.parse(localStorage.getItem('shoppingList'));
        if(storage) {
            this.items = storage;
        }
    }
}