import Courses from "../components/Courses";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";

function HomePage(){
    return(
        <div>
             <Navbar/>
             <Searchbar/>
            
             <Courses/>
         
             <Footer/>
        </div> 
    )
}
export default HomePage;