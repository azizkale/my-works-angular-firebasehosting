import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor(private snackBar: MatSnackBar) {}
  alert(text: string, classForColor: string, parentElement: HTMLElement) {
    const alertTemplate = `
    <div #alert id="alert"
    class="alert ${classForColor} alert-dismissible fade show"
    role="alert"
  >
    <strong>${text}</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"   onclick="document.getElementById('alert').style.display='none'"></button>

  `;
    parentElement.innerHTML = alertTemplate;
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }
}
