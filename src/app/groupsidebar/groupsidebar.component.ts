import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { RolesService } from '../services/roles.service';
import { Roles } from 'src/models/Roles';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'groupsidebar',
  templateUrl: './groupsidebar.component.html',
  styleUrls: ['./groupsidebar.component.css']
})
export class GroupsidebarComponent implements OnInit {
  uid = localStorage.getItem('uid')
  selectedGroupId: any
  allowedToAdminAndMentorAndPirEditor: boolean;

  constructor(
    private authService: AuthenticationService,
    private roleservice: RolesService,
    private groupservice: GroupService
  ) { }

  async ngOnInit() {
    this.selectedGroupId = localStorage.getItem('groupId');
    await this.roleControll(this.selectedGroupId, this.uid);

  }

  w3_open(mySidebar: any, myOverlay: any) {
    if (mySidebar.style.display === "block") {
      mySidebar.style.display = "none";
      myOverlay.style.display = "none";
    } else {
      mySidebar.style.display = "block";
      myOverlay.style.display = "block";
    }
  }
  // Close the sidebar with the close button
  w3_close(mySidebar: HTMLElement, myOverlay: HTMLElement) {
    mySidebar.style.display = "none";
    myOverlay.style.display = "none";
  }

  singOut() {
    this.authService.signOut();

  }

  roleControll(groupId: any, uid: any) {
    this.roleservice.getUserRolesInTheGroup(groupId, uid).subscribe({
      next: (roles) => {
        this.allowedToAdminAndMentorAndPirEditor =
          roles?.includes(Roles[1]) || roles?.includes(Roles[2])
      }
    })
  }
}
