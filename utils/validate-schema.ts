import Ajv from 'ajv';

export function validateSchema(jsonResponseBody: unknown, schema: object): void {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(jsonResponseBody);
    if (!valid) {
        throw new Error(`Schema validation errors: ${JSON.stringify(validate.errors)}`);
    }
}