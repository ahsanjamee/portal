import { useTranslate } from '@/translations/provider';
import { Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type IUploadImageProps = {
    file: string;
    setFile: (value: string) => void;
    mutateAsync: any;
    uploading: boolean;
    resourceFor?: string;
    formType?: string;
    id?: string;
    index?: string;
};

const UploadImageWithNoPreview: React.FC<IUploadImageProps> = ({
    file,
    setFile,
    mutateAsync,
    uploading,
    resourceFor,
    formType,
    id,
    index,
}) => {
    const t = useTranslate();
    // const [name, setName] = useState('');

    //for maintaing local loading state
    const [localLoading, setLocalLoading] = useState<{ [key: string]: boolean }>({});

    const uploadImages = async (files: File[]) => {
        const file = files[0];
        setLocalLoading((prevState) => ({ ...prevState, [index as string]: true }));
        const payload = {
            file,
            id,
            resourceFor,
            formType,
        };

        const response = await mutateAsync(id !== undefined ? payload : (file as File));
        if (response !== undefined) {
            const img = response.url;
            // setName(response.originalName);
            setFile(img);
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
        setLocalLoading((prevState) => ({ ...prevState, [index as string]: false }));
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
                <div
                    className={`relative w-full p-3 border rounded-lg ${uploading ? 'bg-gray-100 cursor-wait' : 'bg-white '}`}
                >
                    {/* <div className="text-sm">{name}</div> */}
                    <img src={file} alt="Uploaded" className="w-full  shadow-md  object-cover" />
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
                <>
                    <div
                        {...getRootProps()}
                        className="bg-white rounded-lg  border-gray-200 border p-3 text-center cursor-pointer w-full col-span-5 relative"
                    >
                        <input {...getInputProps()} />
                        {localLoading[index as string] ? (
                            <div className="flex justify-center items-center w-full h-full">
                                <Loader size={'sm'} />
                            </div>
                        ) : (
                            <div className="text-gray-600 flex justify-center items-center flex-col">
                                <div className="text-neutral-400 text-sm my-1 ml-3 flex">
                                    <div className="text-[#6840c6] text-sm font-bold mr-1">Click to upload</div>
                                    or drag and drop
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default UploadImageWithNoPreview;
