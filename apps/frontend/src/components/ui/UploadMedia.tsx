import { useTranslate } from '@/translations/provider';
import { Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from '../icons/AllIcons';

type IUploadImageProps = {
    file: any;
    setFile: (value: any) => void;
    setId: (value: string) => void;
    mutateAsync: any;
    uploading: boolean;
};
const bytesToMB = (bytes: number): string => (bytes / (1024 * 1024)).toFixed(2);

const UploadMedia: React.FC<IUploadImageProps> = ({ file, setFile, mutateAsync, uploading, setId }) => {
    const t = useTranslate();

    const uploadImages = async (files: File[]) => {
        const file = files[0];

        const response = await mutateAsync(file as File);
        if (response !== undefined) {
            setId(response.id);
            setFile(response);
            notifications.show({
                message: t('Upload successful'),
                color: 'green',
            });
        } else {
            notifications.show({
                message: t('Upload failed'),
                color: 'red',
            });
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'video/mp4': ['.mp4'],
            'video/x-msvideo': ['.avi'],
            'video/quicktime': ['.mov'],
            'video/x-ms-wmv': ['.wmv'],
            'video/x-matroska': ['.mkv'],
            'video/x-flv': ['.flv'],
        },
        maxFiles: 1, // Limit to only one file
        maxSize: 1 * 1024 * 1024 * 1024, // Max size in bytes (1GB)
        onDrop: useCallback(
            async (acceptedFiles: File[]) => {
                if (acceptedFiles.length !== 0) {
                    await uploadImages(acceptedFiles);
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [],
        ),
        onDropRejected: (fileRejections) => {
            if (fileRejections.length > 0) {
                if (fileRejections[0]?.errors[0]?.code === 'file-invalid-type') {
                    notifications.show({
                        message: t('File type is invalid'),
                        color: 'red',
                    });
                }
                if (fileRejections[0]?.errors[0]?.code === 'file-too-large') {
                    notifications.show({
                        message: 'File size is larger than 1 GB',
                        color: 'red',
                    });
                }
                if (fileRejections[0]?.errors[0]?.code === 'too-many-files') {
                    notifications.show({
                        message: t('Only one file can be uploaded'),
                        color: 'red',
                    });
                }
            }
        },
    });

    return (
        <>
            {Object.keys(file).length > 0 ? (
                <div className="relative w-full">
                    <div className="border border-dashed border-gray-400 rounded-md p-5">
                        <div className="font-bold text-base">{file.originalName || file.name}</div>
                        <div className="text-xs text-gray-400">{bytesToMB(file.size)} MB</div>
                    </div>
                    <button
                        onClick={() => {
                            setFile('');
                            setId('');
                        }}
                        className="absolute bg-white rounded-full z-50 shadow-xl top-[-10px] right-[-10px] p-1 hover:rotate-180 transition-all duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#000"
                            className="w-4 h-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <>
                    <div
                        {...getRootProps()}
                        className="bg-white rounded-md border-dashed border-gray-400 border-2 p-6 text-center cursor-pointer w-full col-span-5 relative"
                    >
                        <input {...getInputProps()} />
                        {uploading ? (
                            <div className="flex justify-center items-center w-full h-full">
                                <Loader size={'xl'} />
                            </div>
                        ) : (
                            <div className="text-gray-600 flex flex-col justify-center items-center">
                                <UploadIcon />
                                <div className="text-neutral-900 text-sm  font-semibold  my-3 ml-3">
                                    <span className="text-vadio-brand-500">{t('Upload video')}</span>{' '}
                                    {t('or drag and drop')}
                                </div>
                                <div className="text-gray-400 text-xs  font-normal  ">
                                    {t('We accept MP4, AVI, MOV, WMV, MKV, FLV (Max. 40MB)')}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default UploadMedia;
