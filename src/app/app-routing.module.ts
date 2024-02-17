import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { MeComponent } from './me/me.component';
import { AuthGuard } from './Auth.Guard';
import { GrouplistComponent } from './me/grouplist/grouplist.component';
import { BooktableComponent } from './me/booktable/booktable.component';
import { HatimComponent } from './group/hatim/hatim.component';
import { SettingsComponent } from './settings/settings.component';
import { ShbComponent } from './works/shb/shb.component';
import { PireditComponent } from './group/piredit/piredit.component';
import { ChaptereditComponent } from './group/piredit/chapteredit/chapteredit.component';
import { DisplayComponent } from './Display/display.component';
import { DisplaypirComponent } from './Display/displaypir/displaypir.component';
import { ChaptersComponent } from './Display/displaypir/chapters/chapters.component';
import { ChapterContentComponent } from './Display/displaypir/chapters/chapter-content/chapter-content.component';
import { GroupComponent } from './group/group.component';
import { GroupinfoComponent } from './group/groupinfo/groupinfo.component';
import { BonusReadComponent } from './group/bonus-read/bonus-read.component';
import { CreateBookComponent } from './group/bonus-read/create-book/create-book.component';

const routes: Routes = [
  { path: '', component: SigninComponent, pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'me',
    component: MeComponent,
    children: [
      { path: '', redirectTo: 'booktable', pathMatch: 'full' },
      { path: 'booktable', component: BooktableComponent },
      { path: 'grouplist', component: GrouplistComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  {
    path: 'group',
    component: GroupComponent,
    children: [
      { path: '', redirectTo: 'groupinfo/:groupid', pathMatch: 'full' },
      { path: 'groupinfo/:groupid', component: GroupinfoComponent },
      { path: 'hatim', component: HatimComponent },
      { path: 'shb', component: ShbComponent },
      { path: 'piredit', component: PireditComponent },
      { path: 'chapter/:pirid/:groupid', component: ChaptereditComponent },
    ],
  },
  {
    path: 'display',
    component: DisplayComponent,
    children: [
      { path: '', redirectTo: 'display', pathMatch: 'full' },
      { path: 'displaypir', component: DisplaypirComponent },
      { path: 'chapter/:id', component: ChaptersComponent },
      {
        path: 'chapterContent/:contentId/:pirId',
        component: ChapterContentComponent,
      },
    ],
  },
  {
    path: 'bonusread',
    component: BonusReadComponent,
    children: [
      { path: '', redirectTo: 'bonusread', pathMatch: 'full' },
      { path: 'create', component: CreateBookComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
