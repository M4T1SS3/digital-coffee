import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import db from '../firebase.tsx';
import { motion } from 'framer-motion';
import BG from '../assets/Zeichenfläche 1.png'
import Image from 'next/image';

const IndexPage: React.FC = () => {
  const [name, setName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const router = useRouter();

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  const options = [
    ['Cat', 'Dog'],
    ['Taking', 'Giving'],
    ['Introvert', 'Extrovert'],
    ['Coffee', 'Tea'],
    ['Books', 'Movies'],
    ['Morning Person', 'Night Owl'],
    ['Summer', 'Winter'],
    ['City', 'Countryside'],
    ['LMU', 'TUM'],
    ['Physical Book', 'E-Book'],
    ['Paul', 'Fillipo']
  ];
  const colors = [
    ['#C9AFFF', '#001AFF'],
    ['#AFFFBC', '#FF00B8'],
    ['#FFF500', '#FFAFC3'],
    ['#0080FF', '#FFD700'],
    ['#32CD32', '#FF4500'],
    ['#ADFF2F', '#8A2BE2'],
    ['#FF6347', '#40E0D0'],
    ['#D2691E', '#9ACD32'],
    ['#F08080', '#20B2AA'],
    ['#B0C4DE', '#00FF7F'],
    ['#FFDAB9', '#DDA0DD']
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'names'), {
        name,
      });

      setName('');
      router.push(`/coffee/${encodeURIComponent(name)}`);
    } catch (error) {
      console.error('Failed to add name and create pairs:', error);
    }
  };

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    setCurrentStep(currentStep + 1);
  };

  return (
    <main className="bg-black min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#a5d3ff] overflow-hidden rounded-[40px] flex flex-row justify-center items-center h-screen w-screen"

      >
       {options.map((option, index) => (
        <React.Fragment key={index}>
          {currentStep === index && (
            <motion.div
            className="h-full w-screen flex-col items-center justify-center rounded-lg "
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              onClick={() => handleOptionClick(1+index)}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <div className='h-1/2 grid place-items-center' style={{backgroundColor: colors[index][0]}}>
                <h2 className='font-bold text-4xl' style={{color: colors[index][1]}}>{option[0]}</h2>
              </div>
              <div className='h-1/2 grid place-items-center' style={{backgroundColor: colors[index][1]}}>
                <h2 className='font-bold text-4xl' style={{color: colors[index][0]}}>{option[1]}</h2>
              </div>
            </motion.div>
          )}
        </React.Fragment>
      ))}
      
        {currentStep === options.length  && 
          <motion.div
            className="h-full  w-full flex items-center justify-center overflow-hidden"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="text-black border-b-2 h-16 mx-4 border-white focus:outline-none focus:border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
            />
            <button
              type="submit"
              className="bg-[#000]  text-white rounded-md px-8 py-4 absolute bottom-4 right-4"
            >
              Submit
            </button>

          </motion.div>
        }
      </form>
    </main>
  );
};

export default IndexPage;
