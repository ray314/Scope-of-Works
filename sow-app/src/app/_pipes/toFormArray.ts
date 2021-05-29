import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl, FormArray } from "@angular/forms";

@Pipe({
  name: 'toFormArray',
  pure: true
})
export class ToFormArray implements PipeTransform {  
  transform(value: any, args?: any): FormArray {
    return value;
  }
}