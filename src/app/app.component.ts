import { LoadingService } from './services/loading.service';
import { AlertService } from './services/alert.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Alert } from './classes/alert';
import { Subscription } from 'rxjs/Subscription';
import './utils/rxjs.operators';
import { MessagingService } from './services/messaging.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  public alerts: Array<Alert> = [];
  public loading = false;

  constructor(
    public alertService: AlertService,
    private loadingService: LoadingService,
    public msg: MessagingService, public auth: AuthService
  ) { }

  ngOnInit() {
    this.subscription.push(
      this.alertService.alerts.subscribe(alert => {
        this.alerts.push(alert);
      })
    );

    this.subscription.push(
      this.loadingService.isLoading.subscribe(isLoading => {
        this.loading = isLoading;
      })
    );

    this.subscription.push(
      this.auth.currentUser
        .filter(user => !!user) // filter null
        .take(1) // take first real user
        .subscribe(user => {
          console.log(user);
          if (user) {
            this.msg.getPermission(user);
            this.msg.monitorRefresh(user);
            this.msg.receiveMessage();
          }
        })
      );
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
}
