import { useState } from "react";
import Courses from "../components/Courses";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";

function HomePage(){
    const [searchQuery, setSearchQuery] = useState("");

    return(
        <div>
             <Navbar/>
             <Searchbar query={searchQuery} onSearch={setSearchQuery}/>
            
             <Courses searchQuery={searchQuery}/>
         
             <Footer/>
        </div> 
    )
}
export default HomePage;
