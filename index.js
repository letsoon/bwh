const { exec } = require('child_process');
const process = require('process');
const { argv } = process;

console.log(argv);
const API_KEY = argv[2].replace('--apiKey=','');
const VEID = argv[3].replace('--veId=','');
const PUSH_KEY = argv[4].replace('--pushKey=','');

const domain = `https://api.64clouds.com/v1/getUsageGraphs?veid=${VEID}&api_key=${API_KEY}`;

    exec(`curl ${domain}`,(error,std,stderr)=>{
      if (error) {
        throw `exec error: ${error}`;
      }
      const res = JSON.parse(std);
      if(res.error !== 0){
        console.log(res);
        throw `请求错误`;
      }
      const today = new Date().toLocaleString('zh-CN');
      const data = res.plan_monthly_data / 1024 / 1024 / 1024 * res.monthly_data_multiplier;
      const usage = res.data_counter / 1024 / 1024 / 1024 * res.monthly_data_multiplier;
      const reset = data - usage;
      const title = encodeURIComponent('流量日志');
      const content = `
      ### ${today}
      - 总量：${usage}GB
      - 已用：${usage}GB
      - 可用：${reset}GB
      `
      const domain2 = `https://sctapi.ftqq.com/${PUSH_KEY}.send?title=${title}&desp=${content}`
      exec(`curl ${domain}`,(error,std,stderr)=>{
        if (error) {
          throw `exec error: ${error}`;
        }
      })
    })
