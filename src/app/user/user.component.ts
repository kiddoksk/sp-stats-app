import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { StudentDetailsModel } from './student-details.model'

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js';
import { Observable } from 'rxjs';
import { debounceTime, take, tap } from 'rxjs/operators';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  loginCompleted: boolean = true;
  public chart: any;
  public myChart: Chart
  form: FormGroup;
  data: StudentDetailsModel;
  isGenderEnabled: boolean = false;
  isRaceEnabled: boolean = false;
  isParentEducationEnabled: boolean = false;
  isLunchEnabled: boolean = false;
  isTestPreparationEnabled: boolean = false;
  disableSave: boolean = true;
  testPreparationOptions = ["none", "completed"];
  lunchOptions = ["standard", "free/reduced"];
  parentEducationOptions = ["bachelor's degree", "some college", "master's degree", "associate's degree", "high school", "some high school"];
  raceOptions = ["group A", "group B", "group C", "group D", "group E"];
  genderOptions = ['male', 'female'];
  genderValue: string = '';
  raceValue: string = '';
  parentEducationValue: string = '';
  lunchValue: string = '';
  testPreparationValue: string = '';


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentService,
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('loginCompleted') != 'true'){
      this.loginCompleted = false;
      this.router.navigateByUrl(`/login`);
    }

    this.form = this.formBuilder.group({
      gender: ['', Validators.required],
      genderValue: ['', Validators.required],
      race: [null],
      raceValue: [null],
      parentEducation: [null],
      parentEducationValue: [null],
      lunch: [null],
      lunchValue: [null],
      testPreparation: [null],
      testPreparationValue: [null],
    });

    this.setupFieldWatchers()
    // this.getStudentData()
    this.enableSave()
    this.getStudentData()
  }


  enableSave() {
    this.form.controls['genderValue'].valueChanges.subscribe(
      (selectedValue) => {
        this.disableSave = false;
      }
    );

    this.form.controls['race'].valueChanges.subscribe(
      (selectedValue) => {
        this.disableSave = false;
      }
    );

    this.form.controls['parentEducation'].valueChanges.subscribe(
      (selectedValue) => {
        this.disableSave = false;
      }
    );

    this.form.controls['lunch'].valueChanges.subscribe(
      (selectedValue) => {
        this.disableSave = false;
      }
    );

    this.form.controls['testPreparation'].valueChanges.subscribe(
      (selectedValue) => {
        this.disableSave = false;
      }
    );
  }

  setupFieldWatchers() {
    this.form.controls['gender'].valueChanges.subscribe(
      (selectedValue) => {
        this.isGenderEnabled = selectedValue;
      }
    );

    this.form.controls['race'].valueChanges.subscribe(
      (selectedValue) => {
        this.isRaceEnabled = selectedValue;
      }
    );

    this.form.controls['parentEducation'].valueChanges.subscribe(
      (selectedValue) => {
        this.isParentEducationEnabled = selectedValue;
      }
    );

    this.form.controls['lunch'].valueChanges.subscribe(
      (selectedValue) => {
        this.isLunchEnabled = selectedValue;
      }
    );

    this.form.controls['testPreparation'].valueChanges.subscribe(
      (selectedValue) => {
        this.isTestPreparationEnabled = selectedValue;
      }
    );
  }


  getStudentData() {
    this.form.controls['genderValue'].valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      this.genderValue = newValue;
    });

    this.form.controls['raceValue'].valueChanges.subscribe(
      (selectedValue) => {
        this.raceValue = selectedValue;
      }
    );

    this.form.controls['parentEducationValue'].valueChanges.subscribe(
      (selectedValue) => {
        this.parentEducationValue = selectedValue;
      }
    );

    this.form.controls['lunchValue'].valueChanges.subscribe(
      (selectedValue) => {
        this.lunchValue = selectedValue;
      }
    );

    this.form.controls['testPreparationValue'].valueChanges.subscribe(
      (selectedValue) => {
        this.testPreparationValue = selectedValue;
      }
    );
  }


  save(){
    this.getStudentData()

    this.studentService.getStudentDetails(this.genderValue, this.raceValue, this.parentEducationValue, this.lunchValue, this.testPreparationValue).subscribe(response => {
      this.data = response;
      this.showGraph()
    });
  }
  showGraph() {
    if (this.myChart) this.myChart.destroy(); //destroy prev chart instance
    this.myChart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart


      data: {// values on X-Axis
        labels: ['Maths', 'Reading', 'Writing'], 
	       datasets: [
          {
            label: "Median",
            data: [this.data.math_median, this.data.reading_median, this.data.writing_median],
            backgroundColor: '#FFA500'
          },
          {
            label: "Average",
            data: [this.data.math_average, this.data.reading_average, this.data.writing_average],
            backgroundColor: 'rgb(255, 153, 153)'
          },
          {
            label: "Sum",
            data: [this.data.math_sum, this.data.reading_sum, this.data.writing_sum],
            backgroundColor: 'rgb(128, 191, 255)'
          }  
        ]
      },
      options: {
        aspectRatio:1.5
      }
    });
	// @ts-ignore: Object is possibly 'null'.
	document.getElementById("chart").scrollIntoView();
  }
}
