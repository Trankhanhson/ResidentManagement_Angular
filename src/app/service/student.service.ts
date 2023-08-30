import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor() { }
  getStudentsData(){
    return [
      {
        id: "ID-1",
        name: "John Doe",
        dateOfBirth: new Date(1998, 5, 15),
        address: "123 Main Street, City A",
        gender: 1,
        phoneNumber: "123-456-7890",
        image: "https://img.freepik.com/free-photo/happy-young-female-student-holding-notebooks-from-courses-smiling-camera-standing-spring-clothes-against-blue-background_1258-70161.jpg?w=2000",
        email: "john.doe@example.com",
      },
      {
        id: "ID-2",
        name: "Jane Smith",
        dateOfBirth: new Date(1999, 3, 20),
        address: "456 Park Avenue, City B",
        gender: 0,
        phoneNumber: "987-654-3210",
        image: "https://www.shutterstock.com/image-photo/portrait-cheerful-male-international-indian-260nw-2071252046.jpg",
        email: "jane.smith@example.com",
      },
      {
        id: "ID-3",
        name: "Michael Johnson",
        dateOfBirth: new Date(2000, 8, 10),
        address: "789 Oak Road, City C",
        gender: 1,
        phoneNumber: "555-123-4567",
        image: "https://img.freepik.com/free-photo/front-view-young-beautiful-lady-red-t-shirt-black-jeans-holding-different-copybooks-files-smiling-with-bag-white_140725-18639.jpg",
        email: "michael.johnson@example.com",
      },
      {
        id: "ID-4",
        name: "Emily Brown",
        dateOfBirth: new Date(1997, 11, 5),
        address: "101 Elm Street, City D",
        gender: 0,
        phoneNumber: "222-333-4444",
        image: "https://www.shutterstock.com/image-photo/portrait-smiling-young-college-student-260nw-1192615495.jpg",
        email: "emily.brown@example.com",
      },
      {
        id: "ID-5",
        name: "David Wilson",
        dateOfBirth: new Date(2001, 1, 25),
        address: "333 Maple Lane, City E",
        gender: 1,
        phoneNumber: "777-888-9999",
        image: "data:image/jpeg;base64,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",
        email: "david.wilson@example.com",
      },
      {
        id: "ID-6",
        name: "Sophia Lee",
        dateOfBirth: new Date(1996, 7, 30),
        address: "505 Birch Street, City F",
        gender: 0,
        phoneNumber: "666-111-2222",
        image: "https://ivyprep.edu.vn/wp-content/uploads/learn_1.jpg",
        email: "sophia.lee@example.com",
      },
      {
        id: "ID-7",
        name: "Daniel Martinez",
        dateOfBirth: new Date(1999, 4, 12),
        address: "222 Pine Avenue, City G",
        gender: 1,
        phoneNumber: "444-555-6666",
        image: "https://img.freepik.com/premium-photo/teenager-student-girl-yellow-pointing-finger-side_1368-40175.jpg",
        email: "daniel.martinez@example.com",
      },
      {
        id: "ID-8",
        name: "Olivia Anderson",
        dateOfBirth: new Date(2000, 2, 18),
        address: "777 Cedar Court, City H",
        gender: 0,
        phoneNumber: "999-888-7777",
        image: "https://media.istockphoto.com/id/1351445530/photo/african-student-sitting-in-classroom.jpg?s=612x612&w=0&k=20&c=1ICaZ03iFLzDmxfBkfDkmBGSgj1SDEpsM3eSDgB1KBk=",
        email: "olivia.anderson@example.com",
      },
      {
        id: "ID-9",
        name: "James Taylor",
        dateOfBirth: new Date(1998, 9, 8),
        address: "909 Oak Avenue, City I",
        gender: 1,
        phoneNumber: "333-999-4444",
        image: "data:image/jpeg;base64,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",
        email: "james.taylor@example.com",
      },
      {
        id: "ID-10",
        name: "Ava Hernandez",
        dateOfBirth: new Date(1997, 6, 22),
        address: "444 Maple Road, City J",
        gender: 0,
        phoneNumber: "111-777-8888",
        image: "https://static8.depositphotos.com/1008303/880/i/450/depositphotos_8803246-stock-photo-asian-college-student.jpg",
        email: "ava.hernandez@example.com",
      },
    ];
  }

  getStudents() {
    return Promise.resolve(this.getStudentsData());
}
}
