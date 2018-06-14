// 定时任务Crontab

module.exports = [{
    interval: '10s', // 执行的时间间隔 支持数字和字符串二种格式，单位是毫秒。如果是字符串，那么会用 think.ms 方法解析为数字。
    immediate: true,
    handle: () => {
        //do something
    }
}, {
    cron: '0 */1 * * *', // 具体见 http://crontab.org/ 如果配置了 interval 属性，那么会忽略该属性。
    handle: 'crontab/test',//  执行任务,执行相应函数或者是路由地址，如：crontab/test。定时任务的执行方法，可以是一个具体的执行函数，也可以是一个路由地址（会根据路由解析，然后执行对应的 Action）。
    type: 'all'
}]
