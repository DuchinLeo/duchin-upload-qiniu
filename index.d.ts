
export interface qiniuOptions {
  accessKey: string,
  secretKey: string,
  scope: string,
  pulicPath: string,
  zone: string,
  alias: string,
  useHttpsDomain?: boolean,
  filterType?: string[],
}
export interface QiniuUploadStatic {
  uploadFile: (src: string) => void
  uploadQiniu: (src: string, dist: string) => void
}

export interface QiniuUploadInstance {
  new(qiniuOptions: qiniuOptions): QiniuUploadStatic
}


declare const QiniuUpload: QiniuUploadInstance

export default QiniuUpload;
