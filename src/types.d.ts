// types.ts (crea este archivo si aún no existe)
import { Request } from 'express';
import { File } from 'multer';

export interface MulterRequest extends Request {
  files?: { [fieldname: string]: File[] } | File[];
}
