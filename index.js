const qiniu = require("qiniu");
const fs = require("fs");

class QiniuUpload {
	constructor(qiniuOptions) {
		const optinos = {
			accessKey: "",
			secretKey: "",
			scope: "",
			pulicPath: "./dist",
			zone: "",
			useHttpsDomain: true,
			useCdnDomain: true,
			alias: "",
			filterType: [],
		};
		this.optinos = Object.assign(optinos, qiniuOptions);
		this.optinos.zone = qiniu.zone[`Zone_${qiniuOptions.zone}`];
		const mac = new qiniu.auth.digest.Mac(
			qiniuOptions.accessKey,
			qiniuOptions.secretKey
		);
		const putPolicy = new qiniu.rs.PutPolicy({
			scope: qiniuOptions.scope,
		});
		this.uploadToken = putPolicy.uploadToken(mac);
		let qiniuConfig = new qiniu.conf.Config();
		qiniuConfig.zone = qiniu.zone.Zone_z2;
		// 是否使用https域名
		qiniuConfig.useHttpsDomain = qiniuOptions.useHttpsDomain;
		// 上传是否使用cdn加速
		qiniuConfig.useCdnDomain = qiniuOptions.useCdnDomain;
		this.qiniuConfig = qiniuConfig;
	}
	async uploadFile(src) {
		const _this = this;
		const pulicPath = _this.optinos.pulicPath;
		let docs = fs.readdirSync(src || pulicPath);

		docs.forEach((doc) => {
			let _src = `${src || pulicPath}/${doc}`;

			let st = fs.statSync(_src);
			// const reg = `${pulicPath.replace(/\//g, "/")}/`;
			const exp = new RegExp(`${pulicPath}/`, "g");

			// 判断是否为文件
			if (st.isFile()) {
				let fileType =
					_src.lastIndexOf(".") !== -1
						? _src.slice(_src.lastIndexOf(".") + 1)
						: "";
				// 过滤文件类型
				if (!_this.optinos.filterType.includes(fileType)) {
					this.uploadQiniu(
						_src,
						`${_this.optinos.alias}/${_src.replace(exp, "")}`
					);
				}
			}
			// 如果是目录则递归调用自身
			else if (st.isDirectory()) {
				this.uploadFile(_src);
			}
		});
	}
	async uploadQiniu(src, dist) {
		const _this = this;
		try {
			const localFile = src;
			const formUploader = new qiniu.form_up.FormUploader(_this.qiniuConfig);
			const putExtra = new qiniu.form_up.PutExtra();
			const key = dist;
			// 文件上传

			await formUploader.putFile(
				_this.uploadToken,
				key,
				localFile,
				putExtra,
				function (respErr, respBody, respInfo) {
					if (respErr) {
						throw respErr;
					}
					if (respInfo.statusCode == 200) {
						console.log(key + "上传七牛云成功");
					} else {
						console.log(respInfo.statusCode);
						console.log(respBody);
					}
				}
			);
		} catch (e) {
			console.log("上传失败".e);
		}
	}
}

module.exports = QiniuUpload;
module.exports.default = QiniuUpload;
