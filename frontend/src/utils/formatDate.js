import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

export const formatRelative = (date) => dayjs(date).fromNow();

export const isOverdue = (date) => dayjs(date).isBefore(dayjs());