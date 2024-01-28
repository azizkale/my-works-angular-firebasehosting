import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-grouplist',
  templateUrl: './grouplist.component.html',
  styleUrls: ['./grouplist.component.css']
})
export class GrouplistComponent implements OnInit {
  groups: any[];
  screenSize: number;
  retrieveGroupsForm: FormGroup
  groupsInfo: {
    groupId: any,
    groupName: string
  }[];

  uid = localStorage.getItem('uid')
  constructor(
    private fb: FormBuilder,
    private groupservice: GroupService,
  ) {

  }


  ngOnInit(): void {
    this.createReteiveGroupsForm()
    this.retrieveAllGroupsNamesOfTheUserByuserId();
  }

  //forms=============
  createReteiveGroupsForm() {
    this.retrieveGroupsForm = this.fb.group({
    });
  }

  //methods================
  retrieveAllGroupsNamesOfTheUserByuserId() {
    this.groupservice.retrieveAllGroupsNamesOfTheUserByuserId(this.uid).subscribe({
      next: (result) => {
        this.retrieveGroupsForm.patchValue(result)
        this.groupsInfo = Object.values(result)

        this.groupsInfo.forEach((info) => {
          this.retrieveGroupsForm.addControl(info.groupId, new FormControl(info.groupId));
          this.retrieveGroupsForm.addControl(info.groupName, new FormControl(info.groupName));
        });
      }, error: (error) => {
        console.log(error.message)
      }
    })
  }

  getGroupId(groupId: any) {
    localStorage.setItem('groupId', groupId.toString());
    // this.groupservice.setSelectedGroupId(groupId);
  }
}
