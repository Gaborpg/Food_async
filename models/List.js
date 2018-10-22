import uniqid from 'uniqid'


export default class List
 {
        constructor(){
            this.items = [];
              }

        addItems(count, unit , ingredient){
                const item = {
                    id: uniqid(),
                    count,
                    unit,
                    ingredient
                            }
                  this.items.push(item);
                  return item;
                                        }

          deletItem(id){
            const index = this.items.findIndex(el => el.id === id);
            this.items.splice(index,1);
                      }

          updateCount(id,newCount){
            this.items.find(el => el.id === id).count = newCount;
                      }


          deletItemAll(){
            if (this.items) {
              this.items.splice(0,this.items.length);
          }

            }



}
