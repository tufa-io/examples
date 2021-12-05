
export const awsEnvs = (credentials) => {
    return {
        AWS_ACCESS_KEY_ID: credentials.accessKeyId,
        AWS_SECRET_ACCESS_KEY: credentials.secretAccessKey,
        AWS_SESSION_TOKEN: credentials.sessionToken
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