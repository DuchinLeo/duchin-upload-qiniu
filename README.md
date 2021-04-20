# 快速开始

### 安装

```bash
npm install duchin-upload-qiniu
```

### 上传文件到七牛云

```JavaScript
const QiniuUpload = require('iwangw-upload-qiniu');
const uploader = new QiniuUpload({
  accessKey: "七牛云AK",
  secretKey: '七牛云SK',
  scope: '存储空间',
  pulicPath: './dist', // 需要上传的目录
  zone: 'z1', // 空间对应的机房，z1代表华北，其他配置参见七牛云文档
  useHttpsDomain: false, // 是否使用https加速 默认true
  alias: 'fat', // 别名前缀 例如http://www.xxx.com/fat/xxxx.js
  filterType: [] // 可选，不需要上传的文件后缀
})
uploader.uploadFile()
```
