import { isValidUrl } from '../utils';
import { MimeTypes } from '../types/mimeTypes';
import { ErrorGenerator } from './errorGenerator';
import { ReportGenerator } from './reportGenerator';
import { boolean } from 'yargs';

const DataBindings: { [key: string]: MimeTypes } = {
    // data formats
    '.json': 'application/json',
    // image formats
    '.png': 'image/png',
    '.bmp': 'image/bmp',
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    // video formats
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm',
    '.mp4': 'video/mp4',
};

export async function pathToMimeType(path: string): Promise<MimeTypes | null> {
    if (path === '') {
        ReportGenerator.add(ErrorGenerator.get('UNSUPPORTED_FILE_TYPE', 'EMPTY_FILE_PATH'));
        return null;
    }

    if (isValidUrl(path)) {
        let ct = await getContentTypeFromUriHeader(path).then(contentType => {
            const values = Object.values(DataBindings);
            for (let value of values) {
                if (value != contentType) 
                    continue;
                return value;
            }
            ReportGenerator.add(ErrorGenerator.get('UNSUPPORTED_FILE_TYPE', path));
            return null;
        }) 
        return ct;
    } else {
        const keys = Object.keys(DataBindings);
        for (let key of keys) {
            if (!path.includes(key)) 
                continue;
            return DataBindings[key];
        }
    
    }

   
    ReportGenerator.add(ErrorGenerator.get('UNSUPPORTED_FILE_TYPE', path));
    return null;
}

export async function getContentTypeFromUriHeader(metaUrl: string): Promise<string | null> {
    var response = await fetch(metaUrl, {
        method: 'HEAD'
    });
    return response.headers.get('Content-Type')
}

