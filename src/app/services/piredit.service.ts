import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Pir } from 'src/models/Pir';
import { Chapter } from 'src/models/Chapter';
import { WordPair } from 'src/models/WordPair';
@Injectable({
  providedIn: 'root'
})
export class PireditService {

  constructor(
    private http: HttpClient,
  ) { }

  createPir(pir: Pir): Observable<any> {
    const body = { pir: pir };
    return this.http.post(environment.url + '/pir/create', body)
  }

  assingPirToGroup(pirinfo: any, groupId: any): Observable<any> {
    const body = { pirinfo: pirinfo, groupId: groupId };
    return this.http.post(environment.url + `/pir/assignpirtogroup`, body)
  }

  retrievePirs(): Observable<any> {
    return this.http.get(environment.url + `/pir/getpirs`)
  }

  // updatePir(pir: Pir) {
  //   const body = { pir: pir };
  //   return this.http.patch(environment.url + '/pir/updatepir', body)
  // }

  deletePir(pirId: any): Observable<any> {
    const body = { pirId: pirId };
    return this.http.delete(environment.url + '/pir/deletepir', { body })
  }

  //adds chapters to already existed Pir
  addChapter(chapter: Chapter) {
    const body = { chapter: chapter };
    return this.http.post(environment.url + '/pir/addchapter', body)
  }

  retrieveAllChapters(pirId: any): Observable<any> {
    return this.http.get(environment.url + `/pir/getallchapters?pirId=${pirId}`)
  }

  retrieveChaptersByEditorId(editorId: any, pirId: any): Observable<any> {
    return this.http.get(environment.url + `/pir/getchaptersbyeditorid?editorId=${editorId}&pirId=${pirId}`)
  }

  updateChapter(chapter: Chapter): Observable<any> {
    const body = { chapter: chapter };
    return this.http.patch(environment.url + '/pir/updatechapter', body)
  }

  deleteChapter(pirId: any, chapterId: any): Observable<any> {
    const body = { pirId: pirId, chapterId: chapterId };
    return this.http.delete(environment.url + '/pir/deletechapter', { body })
  }

  createWordPair(wordpair: WordPair): Observable<any> {
    const body = { wordpair: wordpair };
    return this.http.post(environment.url + '/pir/createeditedwordpair', body)
  }

  updateWordPair(wordPair: WordPair) {
    const body = { wordPair: wordPair };
    return this.http.patch(environment.url + '/pir/updatewordpair', body)
  }

  getEditorNameByEditorId(editorId: string): Observable<any> {
    return this.http.get(environment.url + `/pir/getEditorNameByEditorId?editorId=${editorId}`)

  }

  retrieveAllWordPairsOfSinglePir(pirId: any): Observable<any> {
    return this.http.get(environment.url + `/pir/getallwordpairsofsinglepir?pirId=${pirId}`)
  }

  deleteWordPair(wordPair: WordPair): Observable<any> {
    const body = { wordPair: wordPair };
    return this.http.delete(environment.url + '/pir/deletewordpair', { body })
  }

  retrievePirList() {
    return this.http.get(environment.url + `/pir/retrievepirlist`)
  }

  retrievePirByPirId(pirId: any): Observable<any> {
    return this.http.get(environment.url + `/pir/retrievepirbypirid?pirId=${pirId}`)
  }

  leaveThePirFromTheGroup(pir: Pir): Observable<any> {
    const body = { pir: pir }
    return this.http.patch(environment.url + `/pir/leavepirfromgroup`, body)
  }
}
