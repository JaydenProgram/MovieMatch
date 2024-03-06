import { useState, useEffect } from 'react';

const Card = ({ children }) => (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="max-w-lg bg-slate-800 rounded-lg shadow-md overflow-hidden">
        {children}
      </div>
    </div>
);

export default function TalkForm() {
  const [formData, setFormData] = useState({
    about: '',
    genre: 'Action',
    age: 'Under 18',
  });
  const [recommendedMovies, setRecommendedMovies] = useState(null);

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
    try {
      const response = await fetch('http://localhost:8000/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: formData.about,
          userGenre: formData.genre,
          userAge: formData.age,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movie recommendations');
      }

      const data = await response.json();

      if (data) {
        setRecommendedMovies(data);
        localStorage.setItem('aiResponse', JSON.stringify(data)); // Save AI response to local storage
        console.log(data);
      }
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
    }
  };
  const handleCancel = () => {
    // Clear local storage and reset form data
    localStorage.removeItem('formData');
    localStorage.removeItem('aiResponse');
    setFormData({
      about: '',
      genre: 'Action',
      age: 'Under 18',
    });
  };

  return (
      <>
        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Form content */}
            <div>
              {/* Your existing form fields */}
              {/* About */}
              <div className="col-span-full">
                <h1 className="text-white text-center font-bold text-xl"><span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-cyan-500 to-blue-100 ">MovieMatch</span></h1>
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-white">
                  About You
                </label>
                <div className="mt-2">
              <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 bg-slate-700"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder={"Give me info about yourself to help me recommend!"}
              />
                </div>
              </div>

              {/* Genre and Age */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
              <button type="button" onClick={handleCancel} className="text-sm font-semibold leading-6 text-white">
                Cancel
              </button>
              <button
                  type="submit"
                  className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                Get Recommendations
              </button>
            </div>
          </form>
        </Card>
        {/* Display separate cards for each movie */}
        {recommendedMovies && (
            <div className="p-12 grid grid-cols-2 gap-4 gap-x-[900px] w-full">
              {Object.values(recommendedMovies).map((movie) => (
                  <div key={movie.id} className="bg-slate-700 text-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{movie.name} ({movie.year})</h3>
                    </div>
                    <img
                        src={`https://picsum.photos/seed/${movie.id}/1000/500`}
                        alt={movie.name}
                        className="w-full h-auto"
                    />
                  </div>
              ))}
            </div>
        )}


      </>
  );
}
