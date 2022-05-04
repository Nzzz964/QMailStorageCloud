export const logger = (module: string) => {
    return {
        info: (message: any, ...optionalParams: any[]) => console.info(`${new Date().toLocaleString()} [INFO] ${module}: ${message}`, ...optionalParams),
        warn: (message: any, ...optionalParams: any[]) => console.warn(`${new Date().toLocaleString()} [WARN] ${module}: ${message}`, ...optionalParams),
        error: (message: any, ...optionalParams: any[]) => console.error(`${new Date().toLocaleString()} [ERROR] ${module}: ${message}`, ...optionalParams),
    };
};