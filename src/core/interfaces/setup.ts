export interface apiConfig {
    staticPath: string,
    port: number,
    security: {

        key: string,
        cert: string,
        ca: string
    },
    logger: string[],
    scanStorage: string,
    clusterNodes?: undefined | 'corsNumber' | number
}