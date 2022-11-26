import { FormGroup } from '@angular/forms';

export const validation = (name: string, title: string, myForm: FormGroup) => {
  const input = myForm.controls[name].errors;

  if (input?.['minlength']) {
    return `El ${title} debe tener mínimo ${input?.['minlength'].requiredLength} caracteres.`;
  }

  if (input?.['maxlength']) {
    return `El ${title} debe tener máximo ${input?.['maxlength'].requiredLength} caracteres.`;
  }

  if (input?.['email']) {
    return `El ${title} debe ser válido.`;
  }

  if (input?.['required']) {
    return `El ${title} es un campo requerido.`;
  } else {
    return `El ${title} tiene que tener solo caracteres numéricos.`;
  }
};
