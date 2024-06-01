import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-toggle-menu',
  templateUrl: './toggle-menu.component.html',
  styleUrls: ['./toggle-menu.component.css'],
})
export class ToggleMenuComponent implements OnInit {
  @ViewChild('btn_group_fab') btn_group_fab: ElementRef;
  @Input() componentName: string;

  buttonControl: Boolean = true;
  constructor() {}

  ngOnInit(): void {
    switch (this.componentName) {
      case 'pireEit':
        this.buttonControl = true;
        break;
      case 'display':
        this.buttonControl = false;
        break;

      default:
        break;
    }
  }

  ngAfterViewInit() {
    this.btn_group_fab.nativeElement.addEventListener('click', () => {
      this.toggleActiveClass();
    });

    this.initializeTooltip();
  }

  private toggleActiveClass() {
    this.btn_group_fab.nativeElement.classList.toggle('active');
  }

  private initializeTooltip() {
    // tooltip initialization logic here
  }
}
