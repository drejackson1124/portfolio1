import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";
import Section4 from "./section4";
import Title from "./titlesec";



function Home({posts, setPosts}){
    return (
        <div>
            <Title title={<h5 className="home-row-title"><span className="dodgerblue">Join</span> the discussion.</h5>}/>
            <Section4/>
            <Section2/>
            <Title title={<h5 className="home-row-title">Find something <span className="dodgerblue">new</span></h5>}/>
            <Section3 posts={posts} setPosts={setPosts}/>
            <Title title={"Rated Most Original"}/>
            <Section1/>
        </div>
    )
}

export default Home;