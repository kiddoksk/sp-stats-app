import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private apiService: ApiService) {}

  getStudentDetails(gender: string, race: string, parent_education: string, lunch: string, test_preparation_course: string) {
    const url = `/student_details/?gender=${gender}&race=${race}&parent_education=${parent_education}&lunch=${lunch}&test_preparation_course=${test_preparation_course}`;
    const finalUrl = url.replace(' ', '%20')

    return this.apiService.get(finalUrl
    );
  }

  login(userName: string, password: string) {
    return this.apiService.post(
      `/user_details/`, {
        user_name: userName,
        password: password
      }
    );
  }

}


