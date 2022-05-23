import uniqid from 'uniqid';

export default class List{
    constructor(){
        this.list = [];
    }

    addItems(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };

        this.list.push(item);

        return item;

    }


    deleteItem(id){
        const index = this.list.findIndex(el => el.id === id)
        //[3,5,7] splice(1,2) --> return [5,7], original [3]
        //[3,5,7] slice (1,2) -- > return 5, original [3,5,7]
        this.list.splice(index, 1);

    }

    updateItem(id, newCount){
        this.list.find(el => el.id === id).count = newCount;
    }

}