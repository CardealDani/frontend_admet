
import { SlChemistry } from "react-icons/sl";
import PredictButton from "../common/PredictButton";
const Header = () => {

    return (
        <div className="w-full h-24 bg-white flex items-center px-16 border-b border-[#dee1e6]">
            <nav className="w-full flex justify-around mx-32 items-center space-x-48">
                <div className="flex items-center">
                    <SlChemistry className="text-3xl text-blue-500 mr-2" />
                    <span className="font-bold text-2xl mt-2">ADMET Predictor</span>
                </div>
                <div>
                    <div className="items-center justify-center flex gap-20">

                        <a href="#home" className=" text-lg hover:text-blue-500 hover:transition-colors duration-200 ">Home</a>
                        <a href="#key_features" className=" text-lg hover:text-blue-500 hover:transition-colors duration-200 ">Key Features</a>
                        <a href="#how_it_works" className=" text-lg hover:text-blue-500 hover:transition-colors duration-200 ">How It Works</a>
                        <a href="#about_project" className=" text-lg hover:text-blue-500 hover:transition-colors duration-200 ">About Project</a>
                        <PredictButton />
                    </div>
                </div>
            </nav>

        </div>
    );
};

export default Header;
