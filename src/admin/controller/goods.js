const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * list action
   * @return {Promise} []
   */
  async listAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';
    const isOnSale = this.get('isOnSale');
    const model = this.model('goods');
    let  data;
    console.log('isOnSale-------------------------: ' + isOnSale)
    if(isOnSale === 'null'||isOnSale === ''||isOnSale === null||isOnSale === undefined||isOnSale === 'undefined'){
         data = await model.where({name: ['like', `%${name}%`]}).field('id,category_id, name, goods_number, is_on_sale, add_time, sort_order, retail_price, sell_volume, primary_pic_url, is_hot, is_limited').order(['id DESC']).page(page, size).countSelect();
    }else{
         data = await model.where({name: ['like', `%${name}%`], is_on_sale: isOnSale}).field('id,category_id, name, goods_number, is_on_sale, add_time, sort_order, retail_price, sell_volume, primary_pic_url, is_hot, is_limited').order(['id DESC']).page(page, size).countSelect();
    }

    return this.success(data);
  }

    /**
     * search action
     * @params productName
     * @return {Promise} []
     */
    async searchAction() {
        const page =  1;
        const size =  10;
        const name = this.get('name') || '';
        const model = this.model('goods');
        console.log('name-------------------------: ' + name)
        let  data = await model.where({name: ['like', `%${name}%`]}).field('id,category_id, name, goods_number, is_on_sale, add_time, sort_order, retail_price, sell_volume, primary_pic_url, is_hot, is_limited').order(['id DESC']).countSelect();
        return this.success(data);
    }

    /**
     * down up goods action
     * @params id
     * @return {Promise} []
     */
    async downUpAction() {
        const id = this.post('id');
        const is_on_sale = this.post('isOnSale');

        const model = this.model('goods');
        console.log('id is -------------------------: ' + id)
        let data = await model.where({id: id}).update({is_on_sale: is_on_sale});
        return this.success(data);
    }


    async infoAction() {
    const id = this.get('id');
    const model = this.model('goods');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('goods');
    values.is_on_sale = values.is_on_sale ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    values.is_hot = values.is_hot ? 1 : 0;
    if (id > 0) {
      await model.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    await this.model('goods').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }
};
