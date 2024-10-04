/**
 * 时间工具类
 */
export const DateUtils = {
    /**
     * 格式化时间
     * @param {时间} time 
     */
    formatTimeStr(time) {
        if(!time){
            return null;
        }
        const date = new Date(time);
        const now = new Date();

        const padZero = (num) => (num < 10 ? '0' + num : num);

        const year = date.getFullYear();
        const month = padZero(date.getMonth() + 1);
        const day = padZero(date.getDate());
        const hours = padZero(date.getHours());
        const minutes = padZero(date.getMinutes());

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

        if (date >= today) {
            // 时间为今天
            return `${hours}:${minutes}`;
        } else if (date >= yesterday) {
            // 时间为昨天
            return `昨天 ${hours}:${minutes}`;
        } else if (year === now.getFullYear()) {
            // 不是今天或昨天，但仍在今年
            return `${month}-${day} ${hours}:${minutes}`;
        } else {
            // 不是今年
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
    }
}