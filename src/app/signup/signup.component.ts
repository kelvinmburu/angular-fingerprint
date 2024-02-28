import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FingerprintjsProAngularService } from '@fingerprintjs/fingerprintjs-pro-angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  signupSuccess = false;

  constructor(private authService: AuthService, private router: Router, private fingerprintService: FingerprintjsProAngularService) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  async onSubmit() {
    const username = this.signupForm.value.username;
    const password = this.signupForm.value.password;
  
    try {
      // Await the promise returned by getVisitorData()
      const visitorData = await this.fingerprintService.getVisitorData();
  
      console.log(`Fingerprint ID: ${visitorData.visitorId}`);
      this.authService.signup(username, password, visitorData.visitorId).subscribe(
        () => {
          this.signupSuccess = true;
          this.router.navigate(['/login']);
        },
        error => {
          // ... error handling ...  
        }
      );
    } catch (error) {
      // Handle error in obtaining the fingerprint ID
      console.error('Error obtaining fingerprint data', error);
    }
  }
}
