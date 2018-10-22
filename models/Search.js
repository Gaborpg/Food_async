// export default "I am an export string.";
//5b984225485c0d676be971e25d019556
//https://www.food2fork.com/api/search
//https://crossorigin.me/
import axios from 'axios';
import {key, proxy} from '../config';
export default class Search{
constructor(query) {
  this.query = query;
}

async getResult(query) {
  try{
  const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
  console.log(res);
  this.result = res.data.recipes;

  console.log(this.result);

}catch(error)
{
  alert(error);
}
}

};
