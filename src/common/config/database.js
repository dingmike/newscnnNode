const mysql = require('think-model-mysql');

module.exports = {
  handle: mysql,
  database: 'nideshop',
  prefix: 'nideshop_', // 数据表前缀，如果一个数据库里有多个项目，那项目之间的数据表可以通过前缀来区分
  encoding: 'utf8mb4',
  host: '',
  port: '3306',
  user: '',
  password: '',
  dateStrings: true
};
