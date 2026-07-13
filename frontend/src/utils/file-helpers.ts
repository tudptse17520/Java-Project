export const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const isValidImageExtension = (fileName: string): boolean => {
    const validExtensions = ["jpg", "jpeg", "png", "webp"];
    const extension = fileName.split(".").pop()?.toLowerCase();
    return validExtensions.includes(extension || "");
};