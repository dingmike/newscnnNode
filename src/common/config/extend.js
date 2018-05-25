// 框架默认没有提供模型的功能，需要加载对应的扩展才能支持，对应的模块为 think-model。修改扩展的配置文件 src/config/extend.js（多模块项目为 src/common/config/extend.js）
const model = require('think-model'); // 数据模型
const cache = require('think-cache'); // 数据缓存

module.exports = [
  model(think.app),
  cache
];
