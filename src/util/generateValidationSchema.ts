import * as Yup from 'yup';
import { RequestFieldTypes } from '../types';

// Generate validation schema based on input fields
const generateValidationSchema = (fields: RequestFieldTypes[]) => {
  const schema: any = {};

  fields.forEach(field => {
    let validator = Yup.string() as any;

    // Adjust validation based on field type
    if (field.type === 'email') {
      validator = Yup.string().email('Invalid email format');
    } else if (field.type === 'number') {
      validator = Yup.number().typeError('Must be a number').nullable();
    }

    // Add required validation if specified
    if (field.name) {
      validator = validator.required(`${field.label} is required`);
    }

    // Add custom rules like min value
    // if (field.min) {
    //   validator = validator.min(
    //     field.min,
    //     `${field.label} must be at least ${field.min}`,
    //   );
    // }

    schema[field.name] = validator;
  });

  return Yup.object().shape(schema);
};

export default generateValidationSchema;
