import Knex from 'knex'
import settings from '../../knexfile';
import {join} from 'path'

const knex = Knex(settings.development); 

export default knex