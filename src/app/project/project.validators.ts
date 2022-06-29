import { FormGroup } from '@angular/forms';
    
export function ConfirmedValidator(availability: string, allocation: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[availability];
        const matchingControl = formGroup.controls[allocation];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (matchingControl.value !> control.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}