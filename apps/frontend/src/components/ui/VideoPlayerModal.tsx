import { useAuthAxios } from '@/lib/http/axios.hook';
import { useTranslate } from '@/translations/provider';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type VideoPlayerModalProps = {
    videoUrl: { id: string };
    title: string;
};

const VideoPlayerModal = NiceModal.create(({ videoUrl, title }: VideoPlayerModalProps) => {
    const modal = useModal();
    const axios = useAuthAxios();
    const [videoError, setVideoError] = useState(false);
    const t = useTranslate();

    const { data, isLoading, error } = useQuery({
        queryKey: ['workout-stream', videoUrl?.id],
        queryFn: () => axios.get(`/super-admin/workouts/${videoUrl?.id}/stream?infoOnly=true`),
        enabled: !!videoUrl?.id,
    });

    // Handle video loading errors
    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        console.error('Video loading error:', e);
        setVideoError(true);
    };

    // Reset error state when data changes
    useEffect(() => {
        if (data) setVideoError(false);
    }, [data]);

    return (
        <Modal opened={modal.visible} onClose={() => modal.remove()} size="xl" title={title} centered>
            {isLoading && <div className="text-center p-4">{t('Loading video')}...</div>}
            {(error || videoError) && (
                <div className="text-center p-4 text-red-500">
                    {t('Error loading video. The video may be unavailable due to CORS restrictions.')}
                    <div className="mt-2 text-sm">{t('Try watching the video directly on the backend server.')}</div>
                    {data && data.data?.streamUrl && (
                        <a
                            href={`${data.data.streamUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            {t('Open in new tab')}
                        </a>
                    )}
                </div>
            )}
            {!videoError && data && data.data?.streamUrl && (
                <video
                    controls
                    className="w-full"
                    style={{ maxHeight: '70vh' }}
                    src={data.data.streamUrl}
                    autoPlay
                    crossOrigin="anonymous"
                    onError={handleVideoError}
                >
                    {t('Your browser does not support the video tag.')}
                </video>
            )}
        </Modal>
    );
});

export default VideoPlayerModal;
