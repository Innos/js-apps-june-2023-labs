let key = 'shoppingCart';

export class ShoppingCartService {
    getShoppingCartItems() {
        let shoppingCart = sessionStorage.getItem(key);
        if(shoppingCart == undefined) {
            return [];
        }

        let shoppingCartObj = JSON.parse(shoppingCart);
        return Object.values(shoppingCartObj);
    }

    _getShoppingCartObj(){
        let shoppingCart = sessionStorage.getItem(key);
        if(shoppingCart == undefined) {
            return {};
        }

        return JSON.parse(shoppingCart);
    }

    addShoppingCartItem(item) {
        let currentItems = this._getShoppingCartObj();
        if(currentItems[item._id]) {
            currentItems[item._id].quantity += 1;
        }
        else {
            currentItems[item._id] = {item, quantity: 1 }
        }

        sessionStorage.setItem(key, JSON.stringify(currentItems));
    }

    removeShoppingCartItem(item) {
        let currentItems = this._getShoppingCartObj();
        let curItem = currentItems[item._id];
        if(curItem.quantity > 1) {
            curItem.quantity -= 1;
        } else {
            delete currentItems[item._id];
        }
        sessionStorage.setItem(key, JSON.stringify(currentItems));
    }

    clearShoppingCart(){
        sessionStorage.removeItem(key);
    }
}