import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  showHead: any = true;
  userinfo:any
  ngOnInit() {

  }
  constructor(private router: Router) {
      router.events.forEach((event) => {
        this.userinfo = localStorage.getItem('currentUser')
        if (event instanceof NavigationStart) {
          if (!this.userinfo && this.userinfo == null) {
            this.showHead = false;
          } else {
            this.showHead = true;
          }
        }
      });
      this.loadScripts()
    }

    // Method to dynamically load JavaScript
   loadScripts() {

    // This array contains all the files/CDNs
    const dynamicScripts = [
       '/assets/js/app.min.js',
       '/assets/js/table.min.js',
       '/assets/js/form.min.js',
       '/assets/js/admin.js',
       '/assets/js/pages/forms/form-data.js',
       '/assets/js/custom.js',
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('footer')[0].appendChild(node);
    }
 }
}
