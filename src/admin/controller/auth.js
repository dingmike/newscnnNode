const Base = require('./base.js');

module.exports = class extends Base {
    async loginAction() {
        const username = this.post('username');
        const password = this.post('password');

        const admin = await this.model('admin').where({username: username}).find();
        if (think.isEmpty(admin)) {
            return this.fail(401, '用户不存在！');
        }

        if (think.md5(password + '' + admin.password_salt) !== admin.password) {
            console.log('密码111111111：  ' + think.md5('admin123' + '' + admin.password_salt))
            return this.fail(400, '用户密码不正确！');
        }

        // 更新登录信息
        await this.model('admin').where({id: admin.id}).update({
            last_login_time: parseInt(Date.now() / 1000),
            last_login_ip: this.ctx.ip
        });


        const TokenSerivce = this.service('token', 'admin');
        console.log('toeknService111111111111' + TokenSerivce)
        const sessionKey = await TokenSerivce.create({
            user_id: admin.id
        });

        if (think.isEmpty(sessionKey)) {
            return this.fail('登录失败');
        }

        const userInfo = {
            id: admin.id,
            username: admin.username,
            avatar: admin.avatar,
            admin_role_id: admin.admin_role_id
        };

        console.log('sessionKey:000000000000' + sessionKey)
        return this.success({token: sessionKey, userInfo: userInfo});
    }

    async logoutAction() {
        const userId = this.post('userId');

    }
};
