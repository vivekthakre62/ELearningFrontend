import { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import AddCourse from "./pages/AddCourse";
import Profile from "./pages/Profile";
import UpdateCourse from "./pages/UpdateCourse";
import RegisteredCourses from "./pages/RegisteredCourses";
import AddContent from "./pages/AddContent";
import Chat from "./pages/Chat";
import RegisteredStudents from "./pages/RegisteredStudents";
import MessageLists from "./pages/MessageLists";
import Contact  from "./pages/Contact";
import AddCategories from "./pages/AddCategories";
import ContentUpload from "./pages/ContentUpload";
import PaymentSection from "./pages/PaymentSection";
import Test from "./pages/Test";
import Question from "./pages/Questions";
import TestForStudent from "./pages/TestForStudent";
import AttemptTest from "./pages/AttemptTest";
import ShowContent from "./pages/ShowContent";

function App() {
return(
 <Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<RegisterPage/>}/>
  <Route path="/addCourse" element={<AddCourse/>}/>
  <Route path="/profile" element={<Profile/>}></Route>
  <Route path="/updateCourse/:courseId" element={<UpdateCourse/>}></Route>
  <Route path="/registeredCourse" element={<RegisteredCourses/>}></Route>
   <Route path="/addContent" element={<AddContent/>}/>
   <Route path="/message/:studentId" element={<Chat/>}></Route>
   <Route path="/registeredStudent" element={<RegisteredStudents/>}></Route>
   <Route path="/messageList" element={<MessageLists/>}></Route>
   <Route path="/contact" element={<Contact/>}></Route>
   <Route path="/addCategories" element={<AddCategories/>}></Route>
   <Route path="/contentUpload/:courseId" element={<ContentUpload/>}></Route>
   <Route path ="/payment" element={<PaymentSection/>}></Route>
    <Route path ="/test" element={<Test/>}></Route>
      <Route path ="/test-student" element={<TestForStudent/>}></Route>
    <Route path ="/add-questions/:testId" element = {<Question/>}/>
    <Route path="attempt-test/:testId" element={<AttemptTest/>}></Route>
    <Route path="show-content/:courseId" element={<ShowContent/>}></Route>

 </Routes>  
)
}

export default App;
