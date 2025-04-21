import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showLoginForm = false;
  showRegisterForm = false;

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    this.showRegisterForm = false; // Asegura que no se muestren ambos
  }

  showRegister() {
    this.showRegisterForm = true;
  }

  showLogin() {
    this.showRegisterForm = false;
  }
}
