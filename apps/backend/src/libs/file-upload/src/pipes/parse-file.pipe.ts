import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseImageFilePipe implements PipeTransform {
    transform(
        files: Express.Multer.File | Express.Multer.File[],
        metadata: ArgumentMetadata,
    ): Express.Multer.File | Express.Multer.File[] {
        if (!files) {
            throw new BadRequestException('Validation_failed_(file_expected)');
        }

        if (Array.isArray(files) && files.length === 0) {
            throw new BadRequestException('Validation_failed_(files_expected)');
        }

        if (Array.isArray(files)) {
            if (!this.verifyImageExtension(files.map((item) => item.mimetype))) {
                throw new BadRequestException('Only_image_files_are_allowed');
            }
            return files;
        }

        if (!this.verifyImageExtension([files.mimetype])) {
            throw new BadRequestException('Only_image_files_are_allowed');
        }

        return files;
    }

    verifyImageExtension(mimes: string[]) {
        return mimes.every((item) => item.includes('image'));
    }
}
