import { schema } from './recordSchema';
import Ajv from 'ajv';

const validateRecord = (record) => {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(record);

    if (!valid) {
        console.error('Validation errors:', validate.errors);
        return false
    }
    return true
}

export { validateRecord }