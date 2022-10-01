import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  isSaveDisabled: boolean = false;
  form: FormGroup;
  loginCompleted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private router: Router,
  ) { }

  save() {
    const that = this;

      const userName = that.form.value.userName;
      const password = that.form.value.password;

    that.isLoading = true;
    that.studentService.login(userName, password).subscribe(responses => {
        that.isLoading = false;
        localStorage.setItem('loginCompleted', 'true');
        that.loginCompleted = true;
        that.router.navigateByUrl(`/login`);
      }), () => {
      that.isLoading = false;
    };
  }

  navigateToHome() {
    this.router.navigateByUrl(`/user`);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    if(localStorage.getItem('loginCompleted') == 'true'){
      this.loginCompleted = true;
    }
  }

}
