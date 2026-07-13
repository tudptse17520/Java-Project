import dayjs from "dayjs";

export const formatDate = (date: string | Date, format = "DD/MM/YYYY") => {
    return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date) => {
    return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};