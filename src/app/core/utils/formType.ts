import {FormArray, FormControl, FormGroup} from '@angular/forms'

export type DetectType<T> = T extends Array<infer U>
  ? FormArray<DetectType<U>>
  : T extends object
  ? FormGroup<FormType<T>>
  : FormControl<T>

export type FormType<T> = {
  [K in keyof T]: DetectType<T[K]>
}
