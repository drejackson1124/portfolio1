import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";



function Home({posts, setPosts}){
    return (
        <div>
            <Section1/>
            <Section2/>
            <Section3 posts={posts} setPosts={setPosts}/>
        </div>
    )
}

export default Home;