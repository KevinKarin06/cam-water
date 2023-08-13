import * as bcrypt from 'bcrypt';
import { PUBLIC_DIR, apiResponse } from './constants';
import { join } from 'path';
import * as fs from 'fs';
import { EOL } from 'os';
import { ApiResponse } from 'src/api/types/api-response';
import { ParseFilePipeBuilder } from '@nestjs/common';

export const hashPassword = async (
  password: string,
  saltRounds = 10,
): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (hash: string, password: string) => {
  return await await bcrypt.compare(password, hash);
};

export const generateOtpCode = (length = 4) => {
  let randomNumber = Math.floor(Math.random() * 10);

  let randomDigits = '';
  for (let i = 0; i < length; i++) {
    randomDigits += randomNumber;
    randomNumber = Math.floor(Math.random() * 10);
  }

  return +randomDigits;
};

export const checkOtpExpired = (createdDate: Date, minutes = 5) => {
  const now = new Date();

  let differenceValue = (now.getTime() - createdDate.getTime()) / 1000;
  differenceValue /= 60;

  return Math.abs(Math.round(differenceValue)) > minutes;
};

export const setErrorResponse = (
  response: ApiResponse,
  message = apiResponse.serverError,
  statusCode = 500,
) => {
  response.code = apiResponse.codes.KO;
  response.message = message;
  response.statusCode = statusCode;
};

export const generateAPIToken = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

export const createDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const writeFile = (filePath, content, append = false) => {
  if (append) {
    fs.appendFileSync(filePath, JSON.stringify(content) + EOL, {
      encoding: 'utf-8',
    });
  } else {
    fs.writeFileSync(`${filePath}`, content, {
      encoding: 'utf-8',
    });
  }
};

export const generateShopifyOutputFilePath = (
  fileName: string,
  type = 'images',
) => {
  return join(PUBLIC_DIR, type, fileName);
};

export const generateFilePath = (filename: string, folder: string) => {
  const dirPath = join(PUBLIC_DIR, folder);
  const filePath = join(dirPath, filename);

  createDir(dirPath);

  return filePath;
};

export const deleteFile = (filePath: string) => {
  fs.unlinkSync(filePath);
};

export const generatePublicUrl = (path: string) => {
  if (!path) {
    return null;
  }

  const url: any = path.replace(/\\/g, '/').split('/');

  url.shift();
  const result = `${process.env.BASE_URL}/${url.join('/')}`;
  return result;
};

export const getDistanceFromLatLonInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 16371000; // Radius of the earth in m
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in m

  return d;
};

export const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const postFileValidator = () =>
  new ParseFilePipeBuilder()
    .addFileTypeValidator({ fileType: 'image/*' })
    .addMaxSizeValidator({ maxSize: 5000 })
    .build({
      fileIsRequired: false,
    });
