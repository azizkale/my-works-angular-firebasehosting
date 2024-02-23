export class Question {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  trueAnswer: string;
  editorId: any;
  pirId: any;
  chapterId: any;
  

  constructor(
    question: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string,
    trueAnswer: string,
    editorId: any,
    pirId: any,
    chapterId: any
  ) {
    this.question = question;
    this.answer1 = answer1;
    this.answer2 = answer2;
    this.answer3 = answer3;
    this.answer4 = answer4;
    this.trueAnswer = trueAnswer;
    this.editorId = editorId;
    this.pirId = pirId;
    this.chapterId = chapterId;
  }
}
