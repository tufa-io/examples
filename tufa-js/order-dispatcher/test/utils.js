
export const awsEnvs = (params) => {
    return {
        AWS_ACCESS_KEY_ID: params.credentials.accessKeyId,
        AWS_SECRET_ACCESS_KEY: params.credentials.secretAccessKey,
        AWS_SESSION_TOKEN: params.credentials.sessionToken,
        AWS_REGION: params.awsRegion,
    }
}

export const pgEnvs = (pgParams)=> {
    return {
        PGHOST: pgParams.host,
        PGUSER: pgParams.user,
        PGDATABASE: pgParams.database,
        PGPASSWORD: pgParams.password,
        PGPORT: pgParams.port
    }
}

export const envsString = (envs) => {
    return Object.entries(envs).map( env => `${env[0]}=${env[1]}`).join(' ');
}

export const  setEnvs = (params) => {
    for (const [key, value] of Object.entries(params)) {
        process.env[key] = value;
    }
}