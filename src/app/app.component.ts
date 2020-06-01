import { LoadingService } from './services/loading.service';
import { AlertService } from './services/alert.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Alert } from './classes/alert';
import { Subscription } from 'rxjs/Subscription';

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
      private loadingService: LoadingService
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
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
}
