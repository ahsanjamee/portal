import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, Group, Modal, Space, Text, Title } from '@mantine/core';
import { useMemo } from 'react';
import { Button } from './button';

type ConsentModalProps = {
    title: string;
    description: string;
    type?: 'warning' | 'delete' | 'info';
    confirmButtonText?: string;
    cancelButtonText?: string;
    portalTarget?: HTMLElement | string;
};

export const ConsentModal = NiceModal.create<ConsentModalProps>(
    ({ title, description, portalTarget, type, cancelButtonText, confirmButtonText }) => {
        const modal = useModal();

        const onConfirm = () => {
            modal.resolve('confirmed');
            modal.remove();
        };

        const hideModal = () => {
            modal.remove();
        };

        /* render confirm button background color  */
        const renderConfirmBtnColor = useMemo(() => {
            switch (type) {
                case 'warning':
                    return 'warning';
                case 'info':
                    return 'default';
                case 'delete':
                    return 'destructive';
                default:
                    return 'default';
            }
        }, [type]);

        return (
            <Modal
                title={
                    <Title order={5} fw={700}>
                        {title}
                    </Title>
                }
                centered
                closeOnEscape={false}
                opened={modal.visible}
                onClose={hideModal}
                withCloseButton={true}
                zIndex={9999}
                portalProps={{ target: portalTarget }}
            >
                <Box component="div">
                    <Text size="sm" className="text-gray-400">
                        {description}
                    </Text>

                    <Space h={32} />
                    <Group justify="flex-end">
                        {hideModal && (
                            <Button type="button" variant="outline" onClick={hideModal}>
                                {cancelButtonText || 'Cancel'}
                            </Button>
                        )}
                        <Button variant={renderConfirmBtnColor} onClick={onConfirm}>
                            {confirmButtonText || 'Confirm'}
                        </Button>
                    </Group>
                </Box>
            </Modal>
        );
    },
);
