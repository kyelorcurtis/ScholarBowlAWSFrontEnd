import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Question } from './Question';
import { QuestionService } from './Question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public questions: Question[]=[];
  public updateQuestion: Question | null | undefined;
  public deleteQuestion: Question | null | undefined;
  public viewQuestion: Question | null | undefined;

  constructor(private questionService: QuestionService) { }

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

  public onAddQuestion(addForm: NgForm): void {
    document.getElementById('add-question-form')?.click();
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
}
