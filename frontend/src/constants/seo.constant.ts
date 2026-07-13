export const DEFAULT_SEO = {
    title: "PBMS - Hệ thống quản lý bãi đỗ xe thông minh",
    description: "Giải pháp toàn diện cho việc vận hành, theo dõi doanh thu và kiểm soát phương tiện tự động.",
    openGraph: {
        type: "website",
        locale: "vi_VN",
        url: "https://pbms-system.com",
        siteName: "PBMS",
        images: [
            {
                url: "/images/og-default.jpg",
                width: 1200,
                height: 630,
                alt: "PBMS Dashboard",
            },
        ],
    },
} as const;