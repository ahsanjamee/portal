import { LocationIcon, MailIcon, PhoneIcon } from '@/components/icons/AllIcons';
import { Divider, Text } from '@mantine/core';
import dayjs from 'dayjs';

interface CompanyDetail {
    icon: React.ReactNode;
    label: string;
    value: string;
}

interface CompanyDetailsCardProps {
    logo: string;
    name: string;
    createdAt: string;
    email: string;
    phone: string;
    address: string;
    // subdomain: string;
}

export const CompanyDetailsCard = ({
    logo,
    name,
    createdAt,
    email,
    phone,
    address,
    // subdomain,
}: CompanyDetailsCardProps) => {
    const companyDetails: CompanyDetail[] = [
        {
            icon: <MailIcon />,
            label: 'Company email',
            value: email,
        },
        {
            icon: <PhoneIcon />,
            label: 'Company phone',
            value: phone,
        },
        // {
        //     icon: <MailIcon />,
        //     label: 'Company subdomain',
        //     value: subdomain,
        // },
        {
            icon: <LocationIcon />,
            label: 'Company address',
            value: address,
        },
    ];

    return (
        <div className="p-4 rounded-sm bg-white">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <img src={logo} alt="logo" className="rounded-lg max-w-[100px] object-cover" />
                    <div className="flex flex-col">
                        <Text fw={700} size="24px">
                            {name}
                        </Text>
                        <Text size="14px" c={'gray'} mt={8}>
                            {dayjs(createdAt).format('MMM D, YYYY')}
                        </Text>
                    </div>
                </div>

                {/* <Button variant={'outline'}>
                    <PencilLine size={12} className="mr-2" />
                    Edit
                </Button> */}
            </div>

            <Divider className="my-6" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-4">
                {companyDetails.map((detail, index) => (
                    <div key={index} className="flex items-center">
                        <div className="w-[42px] h-[42px]">{detail.icon}</div>

                        <div className="ml-3">
                            <Text fw={500} size="14px" c={'gray'}>
                                {detail.label}
                            </Text>
                            <Text size="14px" mt={8} fw={500}>
                                {detail.value}
                            </Text>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
