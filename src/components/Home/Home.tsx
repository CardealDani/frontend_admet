// src/pages/Home/Home.tsx
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import AboutSection from './AboutSection';

const Home = () => {
    return (
        <div className="w-full flex flex-col pt-20"> {/* pt-20 por causa do Header fixo */}

            <section id="home">
                <HeroSection />
            </section>

            <section id="key_features">
                <FeaturesSection />
            </section>

            <section id="how_it_works">
                <HowItWorksSection />
            </section>

            <section id="about_project">
                <AboutSection />
            </section>
        </div>
    );
};

export default Home;