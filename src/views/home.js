import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";
import Title from "./titlesec";



function Home({posts, setPosts}){
    return (
        <div>
            <Title title={"Most Original Hits"}/>
            <Section1/>
            <Title title={"4+ Stars Rated By Viewers"}/>
            <Section2/>
            <Title title={"Find Something New"}/>
            <Section3 posts={posts} setPosts={setPosts}/>
        </div>
    )
}

export default Home;