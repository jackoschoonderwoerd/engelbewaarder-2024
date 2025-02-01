import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from './auth.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { SnackbarService } from '../../services/snackbar.service';
import { UserCredential } from '@angular/fire/auth';

@Component({
    selector: 'app-login',
    imports: [

        ReactiveFormsModule,
        MatFormFieldModule,
        MatInput,
        MatButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {


    form: FormGroup;
    fb = inject(FormBuilder)
    router = inject(Router)
    authStore = inject(AuthStore);
    sb = inject(SnackbarService)

    ngOnInit(): void {
        this.initForm()
    }
    initForm() {
        this.form = this.fb.group({
            email: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required
            ])
        })
    }
    onSubmit() {
        const formValue = this.form.value
        this.authStore.login(formValue.email, formValue.password)
    }
    onCancel() {
        this.router.navigateByUrl('/home')
    }
}
