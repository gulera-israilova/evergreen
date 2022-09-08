import * as toStream from 'buffer-to-stream';
import {v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse} from 'cloudinary';


cloudinary.config({
  cloud_name: 'hfn3jjjuo',
  api_key: '218756712529834',
  api_secret: 'qY-YqS2x4g-vM_xlu3DK-3Eg_gY'
})
export const filter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Неверный тип изображения. Допустимые типы: "jpg/jpeg/png/gif"'), false);
  }
  callback(null, true);
};

export const upload = async (file): Promise<UploadApiResponse | UploadApiErrorResponse> => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    toStream(file.buffer).pipe(upload);
  });
}

export const get = async (id): Promise<string | null> => {
  try {
    const img = await cloudinary.api.resource(id);
    return img.secure_url;
  } catch (e) {
    return null;
  }
}

export const _delete = async (id): Promise<string> => {
  return cloudinary.api.delete_resources([id]);
}

export const restore = async (id): Promise<string> => {
  return cloudinary.api.restore([id]);
}