const { exec } = require('child_process');
const process = require('process');
const { argv } = process;

const API_KEY = argv[2].replace('--apiKey=', '');
const VEID = argv[3].replace('--veId=', '');
const PUSH_KEY = argv[4].replace('--pushKey=', '');
const channel = '9';

const domain = `https://api.64clouds.com/v1/getServiceInfo`;

exec(`curl -d "api_key=${API_KEY}&veid=${VEID}" ${domain}`, (error, std) => {
    let desp = "";
    const res = JSON.parse(std);
    const today = new Date().toLocaleString('zh-CN',{
        timeZone: 'Asia/Shanghai',
        hour12: false,
    });
    const data = res.plan_monthly_data / 1024 / 1024 / 1024 * res.monthly_data_multiplier;
    const usage = res.data_counter / 1024 / 1024 / 1024 * res.monthly_data_multiplier;
    const reset = data - usage;

    const title = encodeURIComponent('流量日志');
   
    if (error) {
        desp = error;
    }else if (res.error !== 0) {
        desp = encodeURIComponent(`${JSON.stringify(res)}`);
    }else{
        desp = encodeURIComponent(`
        ### ${today}
        - 总量：${data}GB
        - 已用：${usage}GB
        - 可用：${reset}GB`
        );
    }
    const domain2 = `https://sctapi.ftqq.com/${PUSH_KEY}.send`
    exec(`curl -d "title=${title}&desp=${desp}&channel=${channel}" ${domain2}`, (error) => {
        if (error) {
            throw `exec error: ${error}`;
        }
    })
})
