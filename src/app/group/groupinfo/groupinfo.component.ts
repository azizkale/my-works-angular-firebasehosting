import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { PireditService } from 'src/app/services/piredit.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';
import { Group } from 'src/models/Group';
import { Pir } from 'src/models/Pir';
import { Roles } from 'src/models/Roles';

@Component({
  selector: 'app-groupinfo',
  templateUrl: './groupinfo.component.html',
  styleUrls: ['./groupinfo.component.css']
})
export class GroupinfoComponent implements OnInit {
  @ViewChild('participantemail_', { static: false }) participantemail_: ElementRef
  @ViewChild('participantid_', { static: false }) participantid_: ElementRef

  retrieveGroupForm: FormGroup
  retrievePirForm: FormGroup
  selectedGroupId: any
  usersOfTheGroup: any[];
  mentorsMetoringGroups: any[] //to display in template
  allowedToAdminAndMentor: boolean;
  pirsInfo: any[] = [] //{pirName,pirId}

  ngbPopoverUserName: string;//to display the user"s name on delete-popover

  constructor(
    private groupservice: GroupService,
    private fb: FormBuilder,
    private userservice: UserService,
    private pirservice: PireditService,
    private roleservice: RolesService
  ) {

  }

  ngOnInit(): void {
    this.selectedGroupId = localStorage.getItem('groupId');
    //to create works for the group and to send to chapterComponent
    this.roleControl(this.selectedGroupId, localStorage.getItem('uid'));
    this.retrieveSingleGroupByGroupId();
    this.createRetrieveGroupForm()
    this.createPirRetrieveForm();

  }

  // forms==================
  createRetrieveGroupForm() {
    this.retrieveGroupForm = this.fb.group({
      groupId: ['', Validators.required],
      mentorId: ['', Validators.required],
      groupName: ['', Validators.required],
      mentorEmail: ['', Validators.required],
      works: [], //it is null for now 
      users: [] //fullfilled below at retrieveSingleGroupByGroupId func.
    });
  }

  createPirRetrieveForm() {
    this.retrievePirForm = this.fb.group({
    });
    //formname array is fullfilled in the retrievePirsList function (below)

  }

  //methods ========================
  retrieveSingleGroupByGroupId() {
    this.groupservice.retrieveSingleGroupOfUserByGroupId(this.selectedGroupId).subscribe({
      next: async (group: Group | any) => {

        this.usersOfTheGroup = []
        this.retrieveGroupForm.patchValue(group)

        //{email,role} list
        this.usersOfTheGroup = Object.values(this.retrieveGroupForm.get('users')?.value);

        //list of the id of the users       
        for (const user of this.usersOfTheGroup) {
          this.userservice.retrieveUserById(user.uid).subscribe({
            next: (result) => {
              user.email = result.email
              this.retrieveGroupForm.addControl(user.uid, new FormControl(user.uid));
              this.retrieveGroupForm.addControl(user.email, new FormControl(user.email));
            }
          })
        }

        //list of pirs of the group
        this.pirsInfo = []
        if (group.works?.pirs) {
          // Get the keys and values as arrays
          const arrPirId = Object.keys(group.works.pirs);
          const arrPirName: any[] = Object.values(group.works.pirs);

          // Create an object array         
          this.pirsInfo = await arrPirId.map((id, index) => ({
            pirId: id,
            pirName: arrPirName[index].pirName,
          }));

          // Sort the pirs array in ascending order based on name
          await this.pirsInfo.sort((a, b) => a.pirName.localeCompare(b.pirName));
          //create fotmcontrol
          await this.pirsInfo.forEach((info) => {
            this.retrievePirForm.addControl(info.pirName, new FormControl(info.pirName));
          });
        }
      }
    })
  }


  leavePirFromGroup(pir: Pir) {
    //leaves pir from group
    //removes pir from groups-> works-> pirs node in DB
    //removes groupId and assigned features of the pir from pir object from pirs node
    this.pirservice.retrievePirByPirId(pir.pirId).subscribe({
      next: (pirr) => {
        this.pirservice.leaveThePirFromTheGroup(pirr).subscribe({
          next: (ress) => {
            this.retrieveSingleGroupByGroupId()
          }
        })
      }
    })

  }

  retrieveSingleUser(email: any) {
    this.userservice.retrieveUserByEmail(email).subscribe(({
      next: (user) => {
        this.participantemail_.nativeElement.innerText = user.email
      }
    }))

  }

  addUserToGroup(email: any) {
    this.userservice.addParticipantToGroup(this.selectedGroupId, email, Roles[3]).subscribe({
      next: (result) => {
        this.retrieveSingleGroupByGroupId()
      }
    })
  }

  roleControl(groupId: any, uid: any) {
    this.roleservice.getUserRolesInTheGroup(groupId, uid).subscribe({
      next: (roles => {
        this.allowedToAdminAndMentor = roles.includes(Roles[1]) || roles.includes(Roles[2])
      })
    })
  }

  deleteParticipantFromGroup() {
    this.groupservice.deleteParticipantFromGroup(this.selectedGroupId, this.ngbPopoverUserName).subscribe({
      next: (result) => {
      }
    })
  }
}
