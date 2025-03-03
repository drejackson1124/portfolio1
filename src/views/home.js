import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";
import Section4 from "./section4";
import Title from "./titlesec";



function Home({posts, setPosts}){
    return (
        <div>
            <Title title={"Most Original Hits"}/>
            <Section1/>
            <Section2/>
            <Title title={"Find Something New"}/>
            <Section3 posts={posts} setPosts={setPosts}/>
            <Title title={"Join the Discussion"}/>
            <Section4/>
        </div>
    )
}

export default Home;