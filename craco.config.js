let path = require('path');

// 使用craco对react脚手架生成的内建配置做修改
module.exports = {
  webpack: {
    alias:{
      '@':path.resolve(__dirname, 'src')
    }
  },
};