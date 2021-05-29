import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

export function WorkAreaValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const illegal = nameRe.test(control.value);
    return illegal ? {illegalName: {value: control.value}} : null;
  }
}

export function UniqueValidator(zones: FormArray): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let count = 0
    let notUnique = false;
    for (let i of zones.controls) {
      if (i.get('name').value == control.value) {
        count++
        if (count > 1) {
          notUnique = true;
          break;
        }
      }
    }
    return notUnique ? {unique: {value: control.value}} : null;
  }
}