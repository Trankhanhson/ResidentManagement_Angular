import { Component,OnInit } from '@angular/core';
import { Student } from '../domain/student';
import { StudentService } from '../service/student.service';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class StudentsComponent implements OnInit{
  students!: Student[];
  student!:Student;
  submitted: boolean = false;
  studentDialog: boolean = false;
  selectedStudents!: Student[] | null;
  constructor(private studentService: StudentService, private messageService: MessageService, private confirmationService: ConfirmationService){

  }
  ngOnInit(): void {
    this.studentService.getStudents().then((data) => (this.students = data));
  }


  openNew() {
    this.student = {};
    this.submitted = false;
    this.studentDialog = true;
}

deleteSelectedStudents() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected students?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.students = this.students.filter((val) => !this.selectedStudents?.includes(val));
            this.selectedStudents = null;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Students Deleted', life: 3000 });
        }
    });
}

editStudent(student: Student) {
    this.student = { ...student };
    this.studentDialog = true;
}

deleteStudent(student: Student) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + student.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.students = this.students.filter((val) => val.id !== student.id);
            this.student = {};
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Deleted', life: 3000 });
        }
    });
}

hideDialog() {
    this.studentDialog = false;
    this.submitted = false;
}

saveStudent() {
    this.submitted = true;

    if (this.student.name?.trim() && this.student.phoneNumber?.trim()) {
        if(this.student.id){
            for(var i = 0;i<this.students.length;i++){
                if(this.students[i].id == this.student.id){
                    this.students[i] = this.student
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                    break;
                }
            }
        }
        else{
            this.student.id = this.createId();
            this.student.image = 'student-placeholder.svg';
            this.students.push(this.student);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Created', life: 3000 });
        }
        this.students = [...this.students];
        this.studentDialog = false;
        this.student = {};
    }
}


createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
}
