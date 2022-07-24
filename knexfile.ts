import {join} from 'path'

export default {
    development: {
        client: 'sqlite3', 
        connection: {
            filename: join(__dirname, 'src', 'database', 'db.sqlite')
        },
        migrations: {
            directory: `${join(__dirname, 'src', 'database', 'migrations')}`
        }
    },
}