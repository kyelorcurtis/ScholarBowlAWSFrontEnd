import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Question } from "./Question";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    private apiServerUrl: String = 'http://scholarbowlquestionsspringboot-env.eba-ygnaamx8.us-east-1.elasticbeanstalk.com';

    constructor(private http: HttpClient) { }

    public addQuestion(question: Question): Observable<Question>{
        return this.http.post<Question>(`${this.apiServerUrl}/api/questions`, question)
    }

    public getQuestions(): Observable<Question[]> {
        return this.http.get<Question[]>(`${this.apiServerUrl}/api/questions`);
    }

    public getBonusQuestions(): Observable<Question[]> {
        return this.http.get<Question[]>(`${this.apiServerUrl}/api/questions/type/bonus`);
    }

    public getFullQuestions(): Observable<Question[]> {
        return this.http.get<Question[]>(`${this.apiServerUrl}/api/questions/type/full-question`);
    }

    public updateQuestion(question : Question, questionId: number): Observable<Question> {
        console.log('Here is the id', question.id)
        return this.http.put<Question>(`${this.apiServerUrl}/api/questions/update/${questionId}`, question);
    }

    public deleteQuestion(questionId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/questions/${questionId}`);
    }
}