import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CoffeePage: React.FC = () => {
  const router = useRouter();
  const name = router.query.name as string | undefined;
  console.log(name)
  const [pairName, setPairName] = useState('');
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [showPairName, setShowPairName] = useState(true);
  const questions = [
    "If you were a pizza topping, what would you be and why?",
    "What would your autobiography be called?",
    "If you could only eat one food for the rest of your life, but it never made you gain weight, what would you choose?",
    "What's your plan in case of a zombie apocalypse?",
    "Would you rather fight one horse-sized duck or a hundred duck-sized horses?",
    "If animals could talk, which one do you think would be the most annoying?",
    "What's your favorite dinosaur and why isn't it a velociraptor?",
    "If you could have a useless superpower, what would it be?",
    "What's the funniest thing that happened to you this week?",
    "If you could choose, what two animals would you combine to create the ultimate animal?",
    "What's the most ridiculous fact you know?",
    "If you had to be trapped in a TV show for a month, which one would you choose?",
    "What was the weirdest thing you believed as a child?",
    "Would you rather always have to sing rather than speak or dance everywhere you go?",
    "What would be the worst buy one, get one free sale of all time?",
    "Do you think aliens exist and if they do, do you think they're also dealing with traffic?",
    "If you could be a character in any movie, who would you be and why?",
    "If you could choose any two famous people to have dinner with, who would they be?",
    "If you were a ghost, where would you haunt and why?",
    "If you could have dinner with any fictional character, who would it be?"
  ];

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setQuestion(questions[randomIndex]);
    setShowPairName(false);
  }

  useEffect(() => {
    const fetchPairName = async () => {
      const response = await fetch('/api/pair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
    
      setPairName(data.pairedName);
      console.log(pairName, data.pairedName);
      setLoading(false);
    };
    if (name) {
      fetchPairName();
    }
  }, [name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.section className='w-screen h-screen bg-[#000]'>

   
      <div
       className={showPairName ? 'w-screen h-screen bg-[#9E00FF]' : 'w-screen h-screen bg-[#2094FF]'} 
      
      >
        <div className='absolute top-4 left-4'>{name + " + " + pairName}</div>
      <div className='grid place-items-center rounded-[40px] w-screen h-screen'>
        {showPairName ===true ? (
          <div className='text-center'>
            <p className='font-semibold text-7xl'>{pairName}</p>
            <p className='font-semibold text-4xl opacity-50'>Your Match</p>
            
          </div>
        ) : (
          <div className='px-8'>
            {question && (
              <p className="text-4xl mt-10 font-semibold">{question}</p>
            )}
      
          </div>
        )}
      </div>
      <button 
              className='underline text-xl cursor-pointer absolute bottom-8 left-1/2 translate-x-[-50%]'
              onClick={getRandomQuestion}
            >
              Get Question
            </button>
    </div>
    </motion.section>
  );
};

export default CoffeePage;
