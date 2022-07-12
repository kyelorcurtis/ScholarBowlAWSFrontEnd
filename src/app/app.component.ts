import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { Question } from './Question';
import { QuestionService } from './Question.service';
import { Packet } from './Packet';
import { PacketService } from './Packet.service';

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
  public addNew: boolean = false;
  public stagedDeleteQuestions: Question[]=[];
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
      this.getPackets();
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

  public searchPackets(key: Number): void {
    const results: Packet[] = [];
    for (const packet of this.packets) {
      if (packet.packetNumber.toString().indexOf(key.toString()) !== -1) {
        results.push(packet);
      }
    }
    this.packets = results;
    if (results.length === 0 || !key) {
      this.getPackets();
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

  public getPackets(): void{
    this.packetService.getPackets().subscribe(
      (response: Packet[]) => {
        this.packets = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getQuestionsByPacket(packetId: number, output: String): void{
    if(packetId !== undefined){
      this.questionService.getQuestionsByPacket(packetId).subscribe(
        (response: Question[]) => {
          if (output === "questions"){
            this.questions = response;
          }
          else if ( output === "staged"){
            this.stagedDeleteQuestions = response;
          }
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
    if (this.localPacket !== undefined){
      addForm.controls['title'].setValue(this.localPacket.title);
      addForm.controls['year'].setValue(this.localPacket.year);
      addForm.controls['packetNumber'].setValue(this.localPacket.packetNumber);
    }
    this.questionService.addQuestion(addForm.value).subscribe(
      (response: Question) => {
        console.log(response);
        this.getQuestions();
        addForm.reset();
        if (this.addNew){
          this.onOpenModal(null, 'add');
          this.addNew = false;
        }
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

  public onAddPacket(addForm: NgForm): void {
    document.getElementById('add-packet-form')?.click();
    this.packetService.addPacket(addForm.value).subscribe(
      (response: Packet) => {
        console.log(response);
        this.localPacket = response;
        this.getPackets();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    )
  }

  public onUpdatePacket(packet: Packet): void {
    this.packetService.updatePacket(packet, packet.id).subscribe(
      (response: Packet) => {
        this.getPackets();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeletePacket(packetId: number | undefined): void {
    if (packetId !== undefined){
      this.packetService.deletePacket(packetId).subscribe(
        (response: void) => {
          this.getPackets();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public onDeleteFullPacket(packetId: number | undefined): void {
    if ( packetId !== undefined){
      this.getQuestionsByPacket(packetId, "staged")
    }
    if (packetId !== undefined){
      this.packetService.deletePacket(packetId).subscribe(
        (response: void) => {
          for (const question of this.stagedDeleteQuestions){
            this.onDeleteQuestion(question.id);
          }
          this.getPackets();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  public onUploadPacket(packetPdf: NgForm): void {
    if (packetPdf !== undefined){

      
      //Add Functionality to use localPacket

      // if (this.localPacket !== undefined){
      //   this.packetService.addPacket(this.localPacket).subscribe(
      //     (response: Packet) => {
      //       console.log(response);
      //       this.getPackets();
      //       packetPdf.reset();
      //     },
      //     (error: HttpErrorResponse) => {
      //       alert(error.message);
      //       packetPdf.reset();
      //     }
      //   )
      // }
    }
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
      this.getQuestionsByPacket(this.viewPacket.id, "questions");
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
