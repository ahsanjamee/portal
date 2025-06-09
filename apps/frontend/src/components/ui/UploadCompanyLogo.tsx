import { useTranslate } from '@/translations/provider';
import { Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCompanyLogoIcon, UploadLogoExampleIcon, UploadPencilIcon } from '../icons/AllIcons';

type IUploadCompanyLogoProps = {
    file: string;
    setFile: (value: string) => void;
    // setId: (value: string) => void;
    mutateAsync: any;
    uploading: boolean;
};

const UploadCompanyLogo: React.FC<IUploadCompanyLogoProps> = ({ file, setFile, mutateAsync, uploading }) => {
    const t = useTranslate();

    const uploadImages = async (files: File[]) => {
        const file = files[0];

        const response = await mutateAsync(file as File);
        if (response !== undefined) {
            // setId(response.id);
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
        accept: { 'image/jpeg': ['.jpeg'], 'image/jpg': ['.jpg'], 'image/png': ['.png'] },
        maxFiles: 1, // Limit to only one file
        maxSize: 10 * 1024 * 1024, // Max size in bytes (2MB)
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
                        message: t('We accept JPEG and PNG files'),
                        color: 'red',
                    });
                }
                if (fileRejections[0]?.errors[0]?.code === 'file-too-large') {
                    notifications.show({
                        message: t('File size is larger than 10 MB'),
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
            {file !== '' ? (
                <div className="relative max-w-[150px] h-full mb-4 mt-2">
                    <img
                        src={file}
                        alt="Uploaded"
                        className="w-full h-full object-contain max-w-[150px] shadow-md rounded-lg"
                    />
                    <button
                        onClick={() => setFile('')}
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
                <div className="w-full h-[130px] flex justify-between items-center">
                    <div
                        {...getRootProps()}
                        className="bg-[#EEF0F2] flex justify-center items-center rounded-full p-6 text-center cursor-pointer w-[100px] h-[100px] relative"
                    >
                        <input {...getInputProps()} />
                        {uploading ? (
                            <div className="flex justify-center items-center w-full h-full">
                                <Loader size={'sm'} />
                            </div>
                        ) : (
                            <div className="text-gray-600 flex flex-col justify-center items-center">
                                <UploadCompanyLogoIcon />
                            </div>
                        )}
                        <div className="absolute -bottom-2 right-0">
                            <UploadPencilIcon />
                        </div>
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-xs text-gray-600 mb-1.5">Example:</p>
                        <UploadLogoExampleIcon />
                        <div className="flex items-center gap-10 mt-2">
                            <p className="text-xs text-gray-600">150x50px</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UploadCompanyLogo;
