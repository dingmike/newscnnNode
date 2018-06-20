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
    let data;
    console.log('isOnSale-------------------------: ' + isOnSale)
    if(isOnSale === 'null'||isOnSale === ''||isOnSale === null||isOnSale === undefined||isOnSale === 'undefined'){
         data = await model.where({name: ['like', `%${name}%`]}).field('id,category_id, name, goods_number, is_on_sale, add_time, sort_order, retail_price, sell_volume, primary_pic_url, is_hot, is_limited').order(['id DESC']).page(page, size).countSelect();
    }else{
         data = await model.where({name: ['like', `%${name}%`], is_on_sale: isOnSale}).field('id,category_id, name, goods_number, is_on_sale, add_time, sort_order, retail_price, sell_volume, primary_pic_url, is_hot, is_limited').order(['id DESC']).page(page, size).countSelect();
    }

    return this.success(data);
  }

    /**
     * detail action
     * @return {Promise} []
     */
    async detailAction() {

        const goodsId = this.get('id');
        const model = this.model('goods');

        console.log('goodsId:-------------------' +  goodsId)

        const info = await model.where({'id': goodsId}).find();
        const gallery = await this.model('goods_gallery').where({goods_id: goodsId}).limit(4).select();
        const attribute = await this.model('goods_attribute').field('nideshop_goods_attribute.value, nideshop_attribute.name').join('nideshop_attribute ON nideshop_goods_attribute.attribute_id=nideshop_attribute.id').order({'nideshop_goods_attribute.id': 'asc'}).where({'nideshop_goods_attribute.goods_id': goodsId}).select();
        const issue = await this.model('goods_issue').select();

        const specificationList =  await model.getSpecificationList(goodsId)

        const brand = await this.model('brand').where({id: info.brand_id}).find();
        const commentCount = await this.model('comment').where({value_id: goodsId, type_id: 0}).count();
        const hotComment = await this.model('comment').where({value_id: goodsId, type_id: 0}).find();
        let commentInfo = {};
        if (!think.isEmpty(hotComment)) {
            const commentUser = await this.model('user').field(['nickname', 'username', 'avatar']).where({id: hotComment.user_id}).find();
            commentInfo = {
                content: Buffer.from(hotComment.content, 'base64').toString(),
                add_time: think.datetime(new Date(hotComment.add_time * 1000)),
                nickname: commentUser.nickname,
                avatar: commentUser.avatar,
                pic_list: await this.model('comment_picture').where({comment_id: hotComment.id}).select()
            };
        }

        const comment = {
            count: commentCount,
            data: commentInfo
        };

        // 当前用户是否收藏
        // const userHasCollect = await this.model('collect').isUserHasCollect(think.userId, 0, goodsId);

        // 记录用户的足迹 TODO
        // await await this.model('footprint').addFootprint(think.userId, goodsId);

        // return this.json(jsonData);
        // 构造gallery为[{name:'', url:''},...]
        let galleryImgs = [];
        for(let i = 0; i < gallery.length; i++){
            let obj = {name: "", url: ''};
            obj.name = gallery[i].img_desc;
            obj.url = gallery[i].img_url;
            galleryImgs.push(obj);
        }

       /* for (let i = 0; i< specificationList.length; i++){
            specificationList[i]['isShowValue'] = false;
            for(let j = 0; j< specificationList[i].valueList.length; j++){
                console.log('isHSow set------------------' + specificationList[i].valueList[j].goods_id)
                specificationList[i][j]['isShow'] = false;
            }
        }*/



        return this.success({
            info: info,
            gallery: galleryImgs,
            attribute: attribute,
            issue: issue,
            comment: comment,
            brand: brand,
            specificationList: specificationList,
            productList: await model.getProductList(goodsId)
        });
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
        console.log('update good\'s downUp stats id is -------------------------: ' + id)
        let data = await model.where({id: id}).update({is_on_sale: is_on_sale});
        return this.success(data);
    }

    /**
     * delete goods action
     * @params id
     * @return {Promise} []
     */
    async deleteAction() {
        const id = this.get('id');
        const model = this.model('goods');
        console.log('delete good\'s id is -------------------------: ' + id)
        let data = await model.where({id: id}).limit(1).delete();
        return this.success(data);
    }




    /**
     * update goods hot state action
     * @params id
     * @return {Promise} []
     */
    async updateHotStateAction() {
        const id = this.post('id');
        const is_hot = this.post('isHot');
        const model = this.model('goods');
        console.log('delete good\'s id is -------------------------: ' + id)
        let data = await model.where({id: id}).update({is_hot: is_hot});
        return this.success(data);
    }



    /**
     * get specifications action
     * @params
     * @return {Promise} []
     */
    async getSpecificationsAction() {
        const model = this.model('specification');
        let data = await model.select();
        return this.success(data);
    }


    /**
     * use id get goods specification value action
     * @params id
     * @return {Promise} []
     */
    async getSpecValueAction() {
        const sepcification_id = this.get('specId');
        const model = this.model('goods_specification');
        let data = await model.where({specification_id: sepcification_id}).select();
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
