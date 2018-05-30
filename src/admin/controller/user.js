const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';

    const model = this.model('user');
    const data = await model.where({username: ['like', `%${name}%`]}).order(['id DESC']).page(page, size).countSelect();

    return this.success(data);
  }

  /*
  *
  * admin user info action
  * @return {promise} []
  * */
    async adminInfoAction() {
        const id = this.get('id');
        console.log('我的ID：：：：：：：：：：：：：：：：' + id)
        const data = await this.model('admin').alias('ad')
            .field(['ad.username','ad.id','ad.avatar', 'ar.role_code', 'sr.role_name'])
            .join({
                table: 'admin_role',
                join: 'inner',
                as: 'ar',
                on: ['id', 'user_id']
            })
            .join({
                table:'sys_role',
                join: 'inner',
                as: 'sr',
                on: ['ar.role_code','role_code']
            })
            .where({user_id: id}).select();

         console.log('数据——————————————————————————：' +  data[0]);

        let adminData = {};
        let rolesArr = [];
        if(data.length>1){
             let info = data[0];
             for(let i=0;i<data.length; i++){
                 rolesArr.push({role_code: data[i].role_code, role_name: data[i].role_name});
             }
             adminData['roles']=rolesArr;
        }else{
             rolesArr.push({role_code: data[0].role_code, role_name: data[0].role_name});
             adminData['roles']=rolesArr;
        }

        adminData['username']=data[0].username;
        adminData['id']=data[0].id;
        adminData['avatar']=data[0].avatar;
        return this.success(adminData);
    }



  async infoAction() {
    const id = this.get('id');
    const model = this.model('user');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('user');
    values.is_show = values.is_show ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
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
    await this.model('user').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }
};
