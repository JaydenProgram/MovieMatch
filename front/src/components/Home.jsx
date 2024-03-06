import "../App.css";
import TalkForm from "./TalkForm";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation.tsx";

function Home() {
    return (
        <BackgroundGradientAnimation>
            <div className="relative z-10">
                <TalkForm />
            </div>
        </BackgroundGradientAnimation>
    );
}

export default Home;