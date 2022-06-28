import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Question } from './Question-component/Question';
import { QuestionService } from './Question-component/Question.service';
import { Packet } from './Packet-component/Packet';
import { PacketService } from './Packet-component/Packet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public questions: Question[]=[];
  public packets: Packet[]=[];
  public packetQuestions: Question[]=[];
  public updateQuestion: Question | null | undefined;
  public deleteQuestion: Question | null | undefined;
  public viewQuestion: Question | null | undefined;
  public viewPacket: Packet | null | undefined;
  public updatePacket: Packet | null | undefined;
  public deletePacket: Packet | null | undefined;
  public localPacket: Packet | undefined;
  title: any;

  public questionTemplateFormGroup = new FormGroup({
    id: new FormControl(''),
    answer: new FormControl(''),
    bonusBeginningQuestion: new FormControl(''),
    bonusLetter: new FormControl(''),
    category: new FormControl(''),
    packetNumber: new FormControl(''),
    pointValue: new FormControl(''),
    questionBody: new FormControl(''),
    questionNumber: new FormControl(''),
    questionType: new FormControl(''),
    year: new FormControl(''),
    title: new FormControl(''),
    packetId: new FormControl('')
  })

  constructor(private questionService: QuestionService, private packetService: PacketService) { }

  ngOnInit(): void {
      this.getQuestions();
  }

  public getBonusQuestions(): void{
    this.questionService.getBonusQuestions().subscribe(
      (response: Question[]) => {
        this.questions = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchQuestions(key: string): void {
    const results: Question[] = [];
    for (const question of this.questions) {
      if (question.category.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || question.year.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1
      || question.title.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || question.questionBody.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || question.answer.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || question.bonusBeginningQuestion.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(question);
      }
    }
    this.questions = results;
    if (results.length === 0 || !key) {
      this.getQuestions();
    }
  }

  public getFullQuestions(): void{
    this.questionService.getFullQuestions().subscribe(
      (response: Question[]) => {
        this.questions = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getQuestions(): void{
    this.questionService.getQuestions().subscribe(
      (response: Question[]) => {
        this.questions = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getQuestionsByPacket(): void{
    const packetId = this.viewPacket?.id;
    if(packetId !== undefined){
      this.questionService.getQuestionsByPacket(packetId).subscribe(
        (response: Question[]) => {
          this.questions = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
    );}
  }

  public onAddQuestion(addForm: NgForm): void {
    document.getElementById('add-question-form')?.click();
    const localPacketId = addForm.controls['packetId'].value;
    for (const packet of this.packets) {
      if (packet.id.toString() === localPacketId){
        this.localPacket = packet;
      }
    }
    console.log(addForm.value, this.localPacket)
    if (this.localPacket !== undefined){
      addForm.controls['title'].setValue(this.localPacket.title);
      addForm.controls['year'].setValue(this.localPacket.year);
      addForm.controls['packetNumber'].setValue(this.localPacket.packetNumber);
    }
    console.log(addForm.value, this.localPacket)
    this.questionService.addQuestion(addForm.value).subscribe(
      (response: Question) => {
        console.log(response);
        this.getQuestions();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    )
  }

  public onUpdateQuestion(question: Question): void {
    const id = question.id;
    const localPacketId = question.packetId;
    for (const packet of this.packets) {
      if (packet.id.toString() === localPacketId.toString()){
        this.localPacket = packet;
      }
    }
    if (this.localPacket !== undefined){
      question.title = this.localPacket.title;
      question.year = this.localPacket.year;
      question.packetNumber = this.localPacket.packetNumber;
    }
    console.log(question, this.localPacket, question.packetId)
    this.questionService.updateQuestion(question, id).subscribe(
      (response: Question) => {
        console.log(response, id);
        this.getQuestions();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeleteQuestion(questionId: number | undefined): void {
    if (questionId !== undefined){
      this.questionService.deleteQuestion(questionId).subscribe(
        (response: void) => {
          this.getQuestions();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public onOpenModal(question: Question | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal')
    if (mode === 'add'){
      button.setAttribute('data-target', '#addQuestionModal')
    }
    if (mode === 'addPacket'){
      button.setAttribute('data-target', '#addPacketModal')
    }
    if (mode === 'delete'){
      this.deleteQuestion = question;
      button.setAttribute('data-target', '#deleteQuestionModal')
    }
    if (mode === 'edit' && question !== null){
      this.updateQuestion = question;
      button.setAttribute('data-target', '#editQuestionModal')
    }
    if (mode === 'view' && question !== null){
      console.log('viewed', question.id)
      this.viewQuestion = question;
      button.setAttribute('data-target', '#viewQuestionModal')
    }
    container?.appendChild(button);
    button.click();
  }

  public onOpenPacketModal(packet: Packet | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal')
    if (mode === 'add'){
      button.setAttribute('data-target', '#addPacketModal')
    }
    if (mode === 'view' && packet !== null){
      this.viewPacket = packet;
      this.getQuestionsByPacket();
      button.setAttribute('data-target', '#viewPacketModal')
    }
    if (mode === 'edit' && packet !== null){
      this.updatePacket = packet;
      button.setAttribute('data-target', '#editPacketModal')
    }
    if (mode === 'delete' && packet !== null){
      this.deletePacket = packet;
      button.setAttribute('data-target', '#deletePacketModal')
    }
    if (mode === 'upload'){
      button.setAttribute('data-target', '#uploadPacketModal')
    }
    container?.appendChild(button);
    button.click();
  }
}
