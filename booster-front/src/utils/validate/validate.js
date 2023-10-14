import { schema } from './recordSchema';
import Ajv from 'ajv';


const validateRecord = (record) => {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    return validate(record);
}

export { validateRecord }