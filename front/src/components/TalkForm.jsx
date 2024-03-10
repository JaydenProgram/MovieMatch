import { useState, useEffect } from 'react';
import username from "../assets/githubpfp.jpg"
import varia from "../assets/OIG2.1Ztc1dbheBWP.jpg"
import ReactCardFlip from 'react-card-flip';

const Card = ({ children, style, showChat }) => (
    <div
        className={`fixed left-0 w-full flex items-center justify-center transition-bottom duration-500 ease-in-out ${showChat ? 'bottom-0' : 'bottom-1/2'}`}
        style={style}
    >
      <div className={`bg-slate-800 rounded-lg shadow-md overflow-hidden transition-width duration-500 ease-in-out ${showChat ? 'rounded-3xl w-[800px]' : 'rounded-lg w-1/4'}`}>
        {children}
      </div>
    </div>
);

const Message = ({content, messager, icon}) => (
    <div className="message text-white m-5">
      <div className="flex flex-row items-center">
        <img src={icon} className="rounded-full mr-1" style={{width: 20}}></img>
        <p className="font-bold">{messager}</p>
      </div>
      <p className="mText">{content}</p>
    </div>
);

export default function TalkForm() {
  const [formData, setFormData] = useState({
    about: '',
    genre: 'Action',
    age: 'Under 18',
  });
  const [recommendedMovies, setRecommendedMovies] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalTokens, setTotalTokens] = useState('');

  useEffect(() => {
    // Retrieve data from local storage on component mount
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = {
      ...formData,
      [name]: value,
    };
    // Save data to local storage
    //  localStorage.setItem('formData', JSON.stringify(newData));
    setFormData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userInput = `About: ${formData.about}, Genre: ${formData.genre}, Age: ${formData.age}`;
      const response = await fetch('http://localhost:8000/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movie recommendations');
      }

      const data = await response.json();

      if (data) {
        setRecommendedMovies(data.main);
        console.log(recommendedMovies);
        localStorage.setItem('aiResponse', JSON.stringify(data)); // Save AI response to local storage
        setShowChat(true);
        setIsLoading(false);
        setTotalTokens(data.totalTokens);
        const newUserMessage = <Message key={messages.length} content={formData.about} messager={"You"} icon={username}/>;
        setMessages(prevMessages => [...prevMessages, newUserMessage]);

        const newMessage = <Message key={messages.length + 1} content={data.chatInfo} messager={"MovieMatch"} icon={varia}/>; // Update key calculation
        setMessages(prevMessages => [...prevMessages, newMessage]); // Update state using functional form

        console.log(messages);
      }
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
    }
  };


  const handleCancel = () => {
    // Clear local storage and reset form data
    localStorage.removeItem('formData');
    localStorage.removeItem('aiResponse');
    setShowChat(false);
    setMessages([]);
    setTotalTokens('')
    setFormData({
      about: '',
      genre: 'Action',
      age: 'Under 18',
    });
  };

  return (
      <>
        <div className="input-form-container w-screen absolute z-10 items-center flex flex-col h-90">
          <div className="messages-container w-1/2 overflow-auto scrollbar-hide">
            {messages}
          </div>
        </div>
        <Card showChat={showChat}>
          <form onSubmit={handleSubmit} className={`p-6 space-y-6  ${showChat ? 'p-6 space-y-6 flex space-x-3': 'p-6 space-y-6'}`}>
            {/* Form content */}
            <div>
              {/* Your existing form fields */}
              {/* About */}
              <div className="col-span-full">
                <h1 className="text-white text-center font-bold text-xl"><span className={`block text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-cyan-500 to-blue-100 ${showChat ? 'hidden' : ''}`}>MovieMatch (OG)</span></h1>
                <label htmlFor="about" className={`block text-sm font-medium leading-6 text-white ${showChat ? 'hidden' : ''}`}>
                  About You
                </label>
                <div className="mt-2">
                  {totalTokens && (
                      <p className="text-sm font-semibold leading-6 text-white">
                        Total tokens used: {totalTokens}
                      </p>
                  )}
              <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className={`block rounded-md border-0 py-1.5 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 bg-slate-700 ${showChat ? "w-[620px]" : "w-full"}`}
                  value={formData.about}
                  onChange={handleChange}
                  placeholder={"Give me info about yourself to help me recommend!"}
              />
                </div>
              </div>

              {/* Genre and Age */}
              <div className={`grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ${showChat ? 'hidden' : ''}`}>
                {/* Genre */}
                <div className="sm:col-span-3">
                  <label htmlFor="genre" className="block text-sm font-medium leading-6 text-white">
                    Preferred Genre
                  </label>
                  <div className="mt-2">
                    <select
                        id="genre"
                        name="genre"
                        autoComplete="genre"
                        className="block w-full rounded-md border-0 py-1.5 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:max-w-xs sm:text-sm sm:leading-6 bg-slate-700"
                        value={formData.genre}
                        onChange={handleChange}
                    >
                      <option>Action</option>
                      <option>Comedy</option>
                      <option>Drama</option>
                      <option>Romance</option>
                      <option>Sci-Fi</option>
                    </select>
                  </div>
                </div>

                {/* Age */}
                <div className="sm:col-span-3">
                  <label htmlFor="age" className="block text-sm font-medium leading-6 text-white">
                    Age Group
                  </label>
                  <div className="mt-2">
                    <select
                        id="age"
                        name="age"
                        autoComplete="age"
                        className="block w-full rounded-md border-0 py-1.5 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:max-w-xs sm:text-sm sm:leading-6 bg-slate-700"
                        value={formData.age}
                        onChange={handleChange}
                    >
                      <option>Under 18</option>
                      <option>18-24</option>
                      <option>25-34</option>
                      <option>35-44</option>
                      <option>45-54</option>
                      <option>55-64</option>
                      <option>65 or Above</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                  type="button"
                  onClick={handleCancel}
                  className={`text-sm font-semibold leading-6 ${isLoading ? "text-gray-400" : "text-white"}`}
                  disabled={isLoading} // Disable the button while loading
              >
                Cancel
              </button>
              <button
                  type="submit"
                  onClick={handleSubmit}
                  className={`flex items-center justify-center rounded-full bg-cyan-600 w-12 h-12 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring focus-visible:ring-cyan-600 ${isLoading ? "bg-cyan-700 hover:bg-cyan-700" : "bg-cyan-600" }`}
                  disabled={isLoading} // Disable the button while loading
              >
                {isLoading ? (
                    // Render loading animation here
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                         width="40px" height="40px" viewBox="0 0 40 40" enableBackground="new 0 0 40 40" xml:space="preserve">
                    <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                        s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                        c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
                                    <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                        C22.32,8.481,24.301,9.057,26.013,10.047z">
                      <animateTransform attributeType="xml"
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 20 20"
                                        to="360 20 20"
                                        dur="0.5s"
                                        repeatCount="indefinite"/>
                    </path>
                    </svg>
                ) : (
                    // Render your SVG icon here
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4"
                    >
                      <path d="M2.87 2.298a.75.75 0 0 0-.812 1.021L3.39 6.624a1 1 0 0 0 .928.626H8.25a.75.75 0 0 1 0 1.5H4.318a1 1 0 0 0-.927.626l-1.333 3.305a.75.75 0 0 0 .811 1.022 24.89 24.89 0 0 0 11.668-5.115.75.75 0 0 0 0-1.175A24.89 24.89 0 0 0 2.869 2.298Z" />
                    </svg>
                )}
              </button>
            </div>
          </form>
        </Card>
        {recommendedMovies && (
            <div className="p-12 grid grid-cols-6 gap-4 w-full">
              <div className="">
                {Object.values(recommendedMovies).slice(0, 3).map((movie) => (
                    <div key={movie.id} className="bg-slate-700 text-white rounded-lg shadow-md overflow-hidden mb-4">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{movie.name} ({movie.year})</h3>
                      </div>
                      <img
                          src={movie.poster_path}
                          alt={movie.name}
                          className="w-full h-auto max-h-48 object-contain"
                      />
                    </div>
                ))}
              </div>
              <div className="col-start-6">
                {Object.values(recommendedMovies).slice(3, 6).map((movie) => (
                    <div key={movie.id} className="bg-slate-700 text-white rounded-lg shadow-md overflow-hidden mb-4">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{movie.name} ({movie.year})</h3>
                      </div>
                      <img
                          src={movie.poster_path}
                          alt={movie.name}
                          className="w-full h-auto max-h-48 object-contain"
                      />
                    </div>
                ))}
              </div>
            </div>
        )}





      </>
  );
}
